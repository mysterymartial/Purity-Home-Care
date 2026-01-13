'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  getAdminChatSessions,
  getMessages,
  updateChatStatus,
  getAdminReviews,
  approveReview,
  rejectReview,
  sendAdminMessage,
  ChatSession,
  Message,
  Review,
} from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { MessageSquare, Star, Settings, LogOut, Bell, Search, Video, Check, X } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inbox' | 'reviews'>('inbox');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        loadData();
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadData = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    try {
      if (activeTab === 'inbox') {
        const sessions = await getAdminChatSessions(token);
        setChatSessions(sessions);
      } else {
        const reviewsData = await getAdminReviews(token);
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [activeTab, authenticated]);

  useEffect(() => {
    if (selectedSession) {
      loadMessages();
      
      // Connect to Socket.IO for real-time updates
      const socketConnection = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
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
    const token = await auth.currentUser?.getIdToken();
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
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    try {
      await approveReview(reviewId, token);
      loadData();
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    const token = await auth.currentUser?.getIdToken();
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-teal-900 text-white flex flex-col">
        <div className="p-6 border-b border-teal-800">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-teal-700 rounded"></div>
            <div>
              <div className="font-bold">Purity</div>
              <div className="text-xs text-teal-300">ADMIN PANEL</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'inbox'
                ? 'bg-teal-700 text-white'
                : 'text-teal-200 hover:bg-teal-800'
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
                ? 'bg-teal-700 text-white'
                : 'text-teal-200 hover:bg-teal-800'
            }`}
          >
            <Star className="w-5 h-5" />
            <span>Manage Reviews</span>
          </button>

          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-200 hover:bg-teal-800 transition">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-teal-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center">
              <span className="text-teal-200 font-semibold">A</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Admin User</div>
              <div className="text-xs text-teal-300">{auth.currentUser?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-teal-200 hover:bg-teal-800 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Dashboard {'>'} {activeTab === 'inbox' ? 'Inbox' : 'Reviews'}</div>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-green-600 font-semibold">System Status: ONLINE</span>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Left Panel - List */}
          <div className="w-80 border-r bg-white">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
              {activeTab === 'inbox' ? (
                <div>
                  {filteredSessions.map((session) => (
                    <button
                      key={session._id}
                      onClick={() => setSelectedSession(session)}
                      className={`w-full p-4 border-b hover:bg-gray-50 transition text-left ${
                        selectedSession?._id === session._id ? 'bg-teal-50 border-teal-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">
                          {session.customerId.substring(0, 20)}...
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(session.updatedAt), 'h:mm a')}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Status: {session.status}
                      </div>
                      <span className="inline-block bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">
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
                      className="p-4 border-b hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {review.text && (
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{review.text}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveReview(review._id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectReview(review._id)}
                            className="text-red-600 hover:text-red-700"
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
                <div className="bg-white border-b p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-semibold">
                        {selectedSession.customerId.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{selectedSession.customerId.substring(0, 20)}...</div>
                      <div className="text-sm text-green-600">• Online</div>
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
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Pending">Status: Pending</option>
                      <option value="Confirmed">Status: Confirmed</option>
                      <option value="Completed">Status: Completed</option>
                    </select>
                    <a
                      href="https://meet.google.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition flex items-center space-x-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Create Google Meet</span>
                    </a>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="text-center text-gray-500 text-sm py-2 border-t border-b mb-4">
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
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'admin' ? 'text-teal-100' : 'text-gray-500'
                          }`}
                        >
                          {format(new Date(message.timestamp), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border-t p-4">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!messageInput.trim() || !selectedSession) return;

                      const token = await auth.currentUser?.getIdToken();
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
                    <button type="button" className="p-2 text-gray-600 hover:text-gray-900">
                      <span className="text-xl">+</span>
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : activeTab === 'reviews' ? (
              <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-4">Review Moderation</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              review.approved
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {review.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      {review.text && (
                        <p className="text-gray-700 mb-4">{review.text}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                        </span>
                        {!review.approved && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveReview(review._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectReview(review._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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

