export interface CreateMessageDTO {
  content: string;
  sender: 'customer' | 'admin';
}

export interface MessageResponseDTO {
  _id: string;
  chatSessionId: string;
  sender: 'customer' | 'admin';
  content: string;
  timestamp: string;
}




