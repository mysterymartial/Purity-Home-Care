export interface CreateChatSessionDTO {
  customerId: string;
}

export interface UpdateChatSessionStatusDTO {
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export interface ChatSessionResponseDTO {
  _id: string;
  customerId: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
  updatedAt: string;
}




