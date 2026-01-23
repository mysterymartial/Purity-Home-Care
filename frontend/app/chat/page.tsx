'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Phone, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { createChatSession, getChatSession, getMessages, sendMessage, Message, ChatSession } from '@/lib/api';
import { format } from 'date-fns';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function ChatPage() {
  const router = useRouter();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPopoverRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const EMOJIS = [
    '😀','😃','😄','😁','😅','😂','🤣','😊','🙂','😉','😍','😘','😌','😎','🥳','🤗','🤔','😮','😢','😭','😡',
    '👍','👎','🙏','👏','🤝','👋','💪','❤️','💙','💚','✨','⭐','🔥','🎉','✅','❗','💬','📞',
    '🧑‍⚕️','🏠','🧓','🧑‍🦽','🛏️','💊','🧼','🧺',
  ] as const;

  const whatsappLink = getWhatsAppLink('Hello, I want to book a service.');

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Check for existing session in localStorage
        let sessionId = localStorage.getItem('chatSessionId');
        
        if (!sessionId) {
          const newSession = await createChatSession();
          sessionId = newSession._id;
          localStorage.setItem('chatSessionId', sessionId);
          setSession(newSession);
        } else {
          const existingSession = await getChatSession(sessionId);
          setSession(existingSession);
        }

        // Load existing messages
        if (sessionId) {
          const existingMessages = await getMessages(sessionId);
          setMessages(existingMessages);
        }

        // Connect to Socket.IO
        const socketConnection = io(process.env.NEXT_PUBLIC_API_URL!, {
          query: { sessionId },
        });

        socketConnection.on('message', (message: Message) => {
          setMessages((prev) => [...prev, message]);
        });

        socketConnection.on('typing', () => {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        });

        setSocket(socketConnection);

        return () => {
          socketConnection.disconnect();
        };
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initializeChat();
  }, []);

  // Close emoji popover on outside click or Esc
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsEmojiOpen(false);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!isEmojiOpen) return;
      const target = e.target as Node;
      if (emojiButtonRef.current?.contains(target)) return;
      if (emojiPopoverRef.current?.contains(target)) return;
      setIsEmojiOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onMouseDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [isEmojiOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const insertEmojiAtCursor = (emoji: string) => {
    const el = inputRef.current;
    if (!el) {
      setInput((prev) => prev + emoji);
      return;
    }

    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    const next = input.slice(0, start) + emoji + input.slice(end);
    setInput(next);

    // Keep cursor right after inserted emoji
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session) return;

    const content = input.trim();
    setInput('');

    try {
      const newMessage = await sendMessage(session._id, content);
      setMessages((prev) => [...prev, newMessage]);
      
      if (socket) {
        socket.emit('message', {
          sessionId: session._id,
          content,
          sender: 'customer',
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Purity Family Services</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/#services" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors">
                Services
              </Link>
              <button className="bg-green-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-600 dark:hover:bg-green-400 transition-all duration-200 shadow-md hover:shadow-lg">
                End Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Chat Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center shadow-md">
                <span className="text-teal-600 dark:text-teal-400 font-bold text-lg">PS</span>
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900 dark:text-white">Purity Support Team</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Online & Ready to help
                </div>
              </div>
            </div>
            <button className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Phone className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
            <div className="text-center text-gray-500 dark:text-gray-400 text-xs font-semibold py-3 border-t border-b border-gray-200 dark:border-gray-700 uppercase tracking-wider">
              TODAY
            </div>

            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 inline-block shadow-md border border-gray-100 dark:border-gray-700 max-w-md">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    Hello! Welcome to Purity Family Services. How can we assist you with our home care or laundry services today?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">10:24 AM</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-2xl p-4 shadow-md ${
                    message.sender === 'customer'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === 'customer' ? 'text-teal-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp CTA */}
          {messages.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-700">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 text-white text-center py-4 rounded-xl font-semibold hover:bg-green-600 dark:hover:bg-green-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
              >
                <MessageSquare className="w-6 h-6" />
                <span>Continue on WhatsApp</span>
              </a>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 flex items-center space-x-3">
            <button type="button" className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <span className="text-2xl">+</span>
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 cursor-text"
              style={{ caretColor: '#14b8a6' }}
            />
            <div className="relative">
              <button
                ref={emojiButtonRef}
                type="button"
                aria-label="Open emoji picker"
                onClick={() => setIsEmojiOpen((v) => !v)}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">😊</span>
              </button>

              {isEmojiOpen && (
                <div
                  ref={emojiPopoverRef}
                  className="absolute bottom-14 right-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-3"
                >
                  <div className="grid grid-cols-8 gap-2">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-lg"
                        onClick={() => {
                          insertEmojiAtCursor(emoji);
                          setIsEmojiOpen(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <span>🛡️</span>
              <span>Secure End-to-End Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>💾</span>
              <span>Chat History Saved</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
        © 2024 Purity Family Services. All rights reserved.
      </div>
    </div>
  );
}

