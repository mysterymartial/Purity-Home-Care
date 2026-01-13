const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ChatSession {
  _id: string;
  customerId: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatSessionId: string;
  sender: 'customer' | 'admin';
  content: string;
  timestamp: string;
}

export interface Review {
  _id: string;
  rating: number;
  text?: string;
  approved: boolean;
  createdAt: string;
}

// Chat API
export const createChatSession = async (): Promise<ChatSession> => {
  const response = await fetch(`${API_URL}/api/chat/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to create chat session');
  return response.json();
};

export const getChatSession = async (sessionId: string): Promise<ChatSession> => {
  const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}`);
  if (!response.ok) throw new Error('Failed to fetch chat session');
  return response.json();
};

export const getMessages = async (sessionId: string): Promise<Message[]> => {
  const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}/messages`);
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

export const sendMessage = async (sessionId: string, content: string): Promise<Message> => {
  const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

// Reviews API
export const submitReview = async (rating: number, text?: string): Promise<Review> => {
  const response = await fetch(`${API_URL}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, text }),
  });
  if (!response.ok) throw new Error('Failed to submit review');
  return response.json();
};

export const getApprovedReviews = async (): Promise<Review[]> => {
  const response = await fetch(`${API_URL}/api/reviews/approved`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};

// Admin API
export const getAdminChatSessions = async (token: string): Promise<ChatSession[]> => {
  const response = await fetch(`${API_URL}/api/admin/chat/sessions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch chat sessions');
  return response.json();
};

export const updateChatStatus = async (
  sessionId: string,
  status: 'Pending' | 'Confirmed' | 'Completed',
  token: string
): Promise<ChatSession> => {
  const response = await fetch(`${API_URL}/api/admin/chat/sessions/${sessionId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update status');
  return response.json();
};

export const getAdminReviews = async (token: string): Promise<Review[]> => {
  const response = await fetch(`${API_URL}/api/admin/reviews`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};

export const approveReview = async (reviewId: string, token: string): Promise<Review> => {
  const response = await fetch(`${API_URL}/api/admin/reviews/${reviewId}/approve`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to approve review');
  return response.json();
};

export const rejectReview = async (reviewId: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/admin/reviews/${reviewId}/reject`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to reject review');
};

export const sendAdminMessage = async (
  sessionId: string,
  content: string,
  token: string
): Promise<Message> => {
  const response = await fetch(`${API_URL}/api/admin/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

