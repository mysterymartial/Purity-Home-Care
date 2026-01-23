'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getAuthToken } from '@/lib/firebase';
import {
  getAdminChatSessions,
  getMessages,
  updateChatStatus,
  getAdminReviews,
  approveReview,
  rejectReview,
  sendAdminMessage,
  getNotificationPreferences,
  updateNotificationPreferences,
  ChatSession,
  Message,
  Review,
} from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { MessageSquare, Star, Settings, LogOut, Bell, Search, Video, Check, X, User, Mail, Save, Globe, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inbox' | 'reviews' | 'settings'>('inbox');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  
  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newChatAlerts: true,
    reviewAlerts: true,
  });
  const [profileSettings, setProfileSettings] = useState({
    displayName: 'Admin User',
    email: auth?.currentUser?.email || '',
  });
  const [systemSettings, setSystemSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30, // seconds
    theme: 'light',
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [refreshIntervalId, setRefreshIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!auth) {
      router.push('/admin/login');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setAuthenticated(true);
          loadData();
        } else {
          router.push('/admin/login');
        }
        setLoading(false);
      },
      (error) => {
        // Handle Firebase auth state errors
        console.error('Firebase auth state error:', error);
        setLoading(false);
        // Redirect to login on auth errors
        router.push('/admin/login');
      }
    );

    return () => unsubscribe();
  }, [router]);

  const loadData = async () => {
    try {
      if (!auth || !auth.currentUser) {
        router.push('/admin/login');
        return;
      }

      const token = await auth.currentUser.getIdToken(true); // Force refresh token
      if (!token) {
        router.push('/admin/login');
        return;
      }

      if (activeTab === 'inbox') {
        const sessions = await getAdminChatSessions(token);
        setChatSessions(sessions);
      } else {
        const reviewsData = await getAdminReviews(token);
        setReviews(reviewsData);
      }
    } catch (error: any) {
      console.error('Failed to load data:', error);
      // Handle Firebase token errors
      if (error?.code?.includes('auth/') || error?.code?.includes('auth')) {
        // Token expired or invalid - redirect to login
        router.push('/admin/login');
      }
    }
  };

  useEffect(() => {
    if (authenticated) {
      if (activeTab !== 'settings') {
        loadData();
      }
      
      // Load other settings from localStorage
      const savedProfileSettings = localStorage.getItem('adminProfileSettings');
      const savedSystemSettings = localStorage.getItem('adminSystemSettings');
      
      if (savedProfileSettings) {
        const parsed = JSON.parse(savedProfileSettings);
        setProfileSettings(parsed);
      }
      if (savedSystemSettings) {
        const parsed = JSON.parse(savedSystemSettings);
        setSystemSettings(parsed);
      }
      
      // Set email from auth
      if (auth?.currentUser?.email) {
        setProfileSettings(prev => ({ ...prev, email: auth?.currentUser?.email || '' }));
      }
      
      // Load notification preferences from API
      const loadNotificationPreferences = async () => {
        const token = await auth?.currentUser?.getIdToken();
        if (!token) return;
        
        try {
          const preferences = await getNotificationPreferences(token);
          setNotificationSettings(preferences);
          // Also save to localStorage as backup
          localStorage.setItem('adminNotificationSettings', JSON.stringify(preferences));
        } catch (error) {
          console.error('Failed to load notification preferences:', error);
          // Fallback to localStorage if API fails
          const savedNotificationSettings = localStorage.getItem('adminNotificationSettings');
          if (savedNotificationSettings) {
            setNotificationSettings(JSON.parse(savedNotificationSettings));
          }
        }
      };
      
      loadNotificationPreferences();
    }
  }, [activeTab, authenticated]);

  // Auto-refresh functionality
  useEffect(() => {
    // Clear existing interval
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      setRefreshIntervalId(null);
    }

    // Set up new interval if auto-refresh is enabled and not on settings tab
    if (systemSettings.autoRefresh && authenticated && activeTab !== 'settings') {
      const interval = setInterval(() => {
        loadData();
      }, systemSettings.refreshInterval * 1000);
      
      setRefreshIntervalId(interval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [systemSettings.autoRefresh, systemSettings.refreshInterval, authenticated, activeTab]);

  useEffect(() => {
    if (selectedSession) {
      loadMessages();
      
      // Connect to Socket.IO for real-time updates
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL is not set. Socket.IO connection will fail.');
        return;
      }

      const socketConnection = io(apiUrl, {
        query: { sessionId: selectedSession._id },
      });

      socketConnection.on('message', (message: Message) => {
        setSessionMessages((prev) => [...prev, message]);
      });

      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [selectedSession]);

  const loadMessages = async () => {
    if (!selectedSession) return;
    try {
      const messages = await getMessages(selectedSession._id);
      setSessionMessages(messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleStatusChange = async (status: 'Pending' | 'Confirmed' | 'Completed') => {
    if (!selectedSession) return;
    const token = await auth?.currentUser?.getIdToken();
    if (!token) return;

    try {
      const updated = await updateChatStatus(selectedSession._id, status, token);
      setSelectedSession(updated);
      setChatSessions((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    const token = await auth?.currentUser?.getIdToken();
    if (!token) return;

    try {
      await approveReview(reviewId, token);
      loadData();
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    const token = await auth?.currentUser?.getIdToken();
    if (!token) return;

    try {
      await rejectReview(reviewId, token);
      loadData();
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      setSettingsSaving(false);
      return;
    }

    try {
      // Save notification preferences to API
      const updatedPreferences = await updateNotificationPreferences(notificationSettings, token);
      setNotificationSettings(updatedPreferences);
      
      // Also save to localStorage as backup
      localStorage.setItem('adminNotificationSettings', JSON.stringify(updatedPreferences));
      localStorage.setItem('adminProfileSettings', JSON.stringify(profileSettings));
      localStorage.setItem('adminSystemSettings', JSON.stringify(systemSettings));
      
      // Show success message
      alert('Settings saved successfully!');
      
      // Apply theme immediately if changed
      if (systemSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (systemSettings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Auto mode - check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const applyTheme = () => {
      if (systemSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (systemSettings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Auto mode
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listen for system theme changes in auto mode
    if (systemSettings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [systemSettings.theme]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const filteredSessions = chatSessions.filter((session) =>
    session.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReviews = reviews.filter((review) =>
    review.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.rating.toString().includes(searchQuery)
  );

  const isDark = systemSettings.theme === 'dark' || 
    (systemSettings.theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`w-64 flex flex-col ${isDark ? 'bg-gray-800 border-r border-gray-700' : 'bg-teal-900'} text-white`}>
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-teal-800'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
              <img
                src="/logo.jpg"
                alt="Purity Home Care Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-teal-300'}`}>ADMIN PANEL</div>
            </div>
          </div>
          <Link href="/" className={`inline-block text-xs mt-3 transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-teal-200 hover:text-white'}`}>
            ← Home
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'inbox'
                ? isDark ? 'bg-gray-700 text-white' : 'bg-teal-700 text-white'
                : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-teal-200 hover:bg-teal-800'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Inbox</span>
            {activeTab === 'inbox' && chatSessions.length > 0 && (
              <span className="ml-auto bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                {chatSessions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'reviews'
                ? isDark ? 'bg-gray-700 text-white' : 'bg-teal-700 text-white'
                : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-teal-200 hover:bg-teal-800'
            }`}
          >
            <Star className="w-5 h-5" />
            <span>Manage Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'settings'
                ? isDark ? 'bg-gray-700 text-white' : 'bg-teal-700 text-white'
                : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-teal-200 hover:bg-teal-800'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-teal-800'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-teal-700'}`}>
              <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-teal-200'}`}>
                {profileSettings.displayName?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{profileSettings.displayName || 'Admin User'}</div>
              <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-teal-300'}`}>{auth?.currentUser?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
              isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-teal-200 hover:bg-teal-800'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`border-b px-6 py-4 flex items-center justify-between ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Dashboard {'>'} {activeTab === 'inbox' ? 'Inbox' : activeTab === 'reviews' ? 'Reviews' : 'Settings'}</div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>System Status: ONLINE</span>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Left Panel - List */}
          <div className={`w-80 border-r ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder={activeTab === 'inbox' ? 'Search chats...' : activeTab === 'reviews' ? 'Search reviews...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  disabled={activeTab === 'settings'}
                />
              </div>
            </div>

            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
              {activeTab === 'settings' ? (
                <div className={`p-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Settings className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className="text-sm">Settings panel is on the right</p>
                </div>
              ) : activeTab === 'inbox' ? (
                <div>
                  {filteredSessions.map((session) => (
                    <button
                      key={session._id}
                      onClick={() => setSelectedSession(session)}
                      className={`w-full p-4 border-b ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition text-left ${
                        selectedSession?._id === session._id 
                          ? isDark ? 'bg-teal-900/30 border-teal-700' : 'bg-teal-50 border-teal-200' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {session.customerId.substring(0, 20)}...
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {format(new Date(session.updatedAt), 'h:mm a')}
                        </div>
                      </div>
                      <div className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Status: {session.status}
                      </div>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                        isDark 
                          ? 'bg-teal-900/50 text-teal-300 border border-teal-700' 
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        {session.status}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {filteredReviews.map((review) => (
                    <div
                      key={review._id}
                      className={`p-4 border-b ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : isDark ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {review.text && (
                        <p className={`text-sm mb-2 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{review.text}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveReview(review._id)}
                            className={`${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectReview(review._id)}
                            className={`${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Detail */}
          <div className="flex-1 flex flex-col">
            {activeTab === 'inbox' && selectedSession ? (
              <>
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-teal-900/50' : 'bg-teal-100'
                    }`}>
                      <span className={`font-semibold ${isDark ? 'text-teal-300' : 'text-teal-600'}`}>
                        {selectedSession.customerId.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedSession.customerId.substring(0, 20)}...</div>
                      <div className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>• Online</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedSession.status}
                      onChange={(e) =>
                        handleStatusChange(
                          e.target.value as 'Pending' | 'Confirmed' | 'Completed'
                        )
                      }
                      className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="Pending">Status: Pending</option>
                      <option value="Confirmed">Status: Confirmed</option>
                      <option value="Completed">Status: Completed</option>
                    </select>
                    <a
                      href="https://meet.google.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 dark:hover:bg-teal-500 transition flex items-center space-x-2`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Create Google Meet</span>
                    </a>
                  </div>
                </div>

                <div className={`flex-1 overflow-y-auto p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className={`text-center text-sm py-2 border-t border-b mb-4 ${
                    isDark ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'
                  }`}>
                    TODAY, {format(new Date(), 'MMM d').toUpperCase()}
                  </div>

                  {sessionMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex mb-4 ${
                        message.sender === 'admin' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-md rounded-lg p-3 ${
                          message.sender === 'admin'
                            ? 'bg-teal-600 text-white'
                            : isDark 
                              ? 'bg-gray-800 text-white border border-gray-700' 
                              : 'bg-white text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'admin' 
                              ? 'text-teal-100' 
                              : isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {format(new Date(message.timestamp), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!messageInput.trim() || !selectedSession) return;

                      const token = await auth?.currentUser?.getIdToken();
                      if (!token) return;

                      try {
                        const content = messageInput.trim();
                        setMessageInput('');

                        const newMessage = await sendAdminMessage(selectedSession._id, content, token);
                        setSessionMessages((prev) => [...prev, newMessage]);

                        if (socket) {
                          socket.emit('message', {
                            sessionId: selectedSession._id,
                            content,
                            sender: 'admin',
                          });
                        }
                      } catch (error) {
                        console.error('Failed to send message:', error);
                        setMessageInput(messageInput); // Restore on error
                      }
                    }}
                    className="flex items-center space-x-2"
                  >
                    <button type="button" className={`p-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                      <span className="text-xl">+</span>
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <button
                      type="submit"
                      className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : activeTab === 'reviews' ? (
              <div className={`flex-1 p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Review Moderation</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className={`rounded-lg shadow p-6 ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : isDark ? 'text-gray-600' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              review.approved
                                ? isDark 
                                  ? 'bg-green-900/50 text-green-300 border border-green-700' 
                                  : 'bg-green-100 text-green-700'
                                : isDark 
                                  ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {review.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      {review.text && (
                        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{review.text}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                        </span>
                        {!review.approved && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveReview(review._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectReview(review._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-500 transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'settings' ? (
              <div className={`flex-1 overflow-y-auto ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Header Section */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-teal-50'}`}>
                        <Settings className={`w-8 h-8 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                      </div>
                      <div>
                        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>Settings</h2>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage your account preferences and system configuration</p>
                      </div>
                    </div>
                    {systemSettings.autoRefresh && (
                      <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${isDark ? 'border-teal-400' : 'border-blue-600'}`}></div>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-blue-700'}`}>
                          Auto-refresh enabled: Refreshing every {systemSettings.refreshInterval} seconds
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notification Settings */}
                  <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    <div className={`p-6 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-teal-100'}`}>
                          <Bell className={`w-6 h-6 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notification Preferences</h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Control how and when you receive notifications</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-5">
                      {[
                        { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive email updates about system activities', icon: Mail },
                        { key: 'newChatAlerts', title: 'New Chat Alerts', desc: 'Get notified when new chat sessions are created', icon: MessageSquare },
                        { key: 'reviewAlerts', title: 'Review Alerts', desc: 'Get notified when new reviews are submitted', icon: Star },
                      ].map((item) => (
                        <label key={item.key} className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
                          isDark 
                            ? 'hover:bg-gray-700/50 border border-gray-700' 
                            : 'hover:bg-gray-50 border border-gray-100'
                        }`}>
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                              <item.icon className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</div>
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</div>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                              className="w-11 h-6 rounded-full appearance-none cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 checked:bg-teal-600 bg-gray-300 relative"
                              style={{
                                background: notificationSettings[item.key as keyof typeof notificationSettings] 
                                  ? '#0d9488' 
                                  : isDark ? '#4b5563' : '#d1d5db'
                              }}
                            />
                            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                              notificationSettings[item.key as keyof typeof notificationSettings] ? 'translate-x-5' : 'translate-x-0'
                            }`}></span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Profile Settings */}
                  <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    <div className={`p-6 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-100'}`}>
                          <User className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Information</h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your personal account details</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profileSettings.displayName}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, displayName: e.target.value }))}
                          className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                            isDark 
                              ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-teal-500' 
                              : 'bg-white border border-gray-300 text-gray-900 focus:border-teal-500'
                          }`}
                          placeholder="Admin User"
                        />
                        <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          This name will be displayed in the sidebar and throughout the dashboard
                        </p>
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-3 flex items-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <Mail className="w-4 h-4" />
                          <span>Email Address</span>
                        </label>
                        <input
                          type="email"
                          value={profileSettings.email}
                          disabled
                          className={`w-full rounded-lg px-4 py-3 cursor-not-allowed ${
                            isDark 
                              ? 'bg-gray-700/50 border border-gray-600 text-gray-400' 
                              : 'bg-gray-50 border border-gray-300 text-gray-600'
                          }`}
                        />
                        <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          Email cannot be changed. Contact system administrator for email updates.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* System Settings */}
                  <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    <div className={`p-6 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-100'}`}>
                          <Globe className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>System Configuration</h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Customize system behavior and appearance</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <label className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
                        isDark 
                          ? 'hover:bg-gray-700/50 border border-gray-700' 
                          : 'hover:bg-gray-50 border border-gray-100'
                      }`}>
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                            <Clock className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Auto Refresh</div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Automatically refresh data at specified intervals</div>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={systemSettings.autoRefresh}
                            onChange={(e) => setSystemSettings(prev => ({ ...prev, autoRefresh: e.target.checked }))}
                            className="w-11 h-6 rounded-full appearance-none cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            style={{
                              background: systemSettings.autoRefresh 
                                ? '#0d9488' 
                                : isDark ? '#4b5563' : '#d1d5db'
                            }}
                          />
                          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                            systemSettings.autoRefresh ? 'translate-x-5' : 'translate-x-0'
                          }`}></span>
                        </div>
                      </label>
                      {systemSettings.autoRefresh && (
                        <div className={`ml-12 p-4 rounded-lg ${isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
                          <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Refresh Interval (seconds)
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="300"
                            value={systemSettings.refreshInterval}
                            onChange={(e) => setSystemSettings(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) || 30 }))}
                            className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                              isDark 
                                ? 'bg-gray-700 border border-gray-600 text-white' 
                                : 'bg-white border border-gray-300 text-gray-900'
                            }`}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              Minimum: 10 seconds, Maximum: 300 seconds
                            </p>
                            <span className={`text-xs font-medium ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                              {Math.floor(systemSettings.refreshInterval / 60)}m {systemSettings.refreshInterval % 60}s
                            </span>
                          </div>
                        </div>
                      )}
                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Theme Preference
                        </label>
                        <select
                          value={systemSettings.theme}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, theme: e.target.value }))}
                          className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                            isDark 
                              ? 'bg-gray-700 border border-gray-600 text-white' 
                              : 'bg-white border border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="light">☀️ Light Mode</option>
                          <option value="dark">🌙 Dark Mode</option>
                          <option value="auto">🔄 Auto (Follow System)</option>
                        </select>
                        <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {systemSettings.theme === 'auto' 
                            ? 'Theme will automatically match your system preference'
                            : systemSettings.theme === 'dark'
                            ? 'Dark mode is currently active'
                            : 'Light mode is currently active'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className={`sticky bottom-0 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-6 pb-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setActiveTab('inbox')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          isDark 
                            ? 'border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500' 
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        disabled={settingsSaving}
                        className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none font-semibold"
                      >
                        {settingsSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save All Settings</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a {activeTab === 'inbox' ? 'chat' : 'review'} to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

