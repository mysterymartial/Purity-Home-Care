import { v4 as uuidv4 } from 'uuid';
import { ChatSessionRepository } from '../repositories/ChatSession.repository';
import { MessageRepository } from '../repositories/Message.repository';
import { CreateChatSessionDTO, UpdateChatSessionStatusDTO, ChatSessionResponseDTO } from '../dto/ChatSession.dto';
import { CreateMessageDTO, MessageResponseDTO } from '../dto/Message.dto';
import mongoose from 'mongoose';

export class ChatSessionService {
  private chatSessionRepository: ChatSessionRepository;
  private messageRepository: MessageRepository;

  constructor() {
    this.chatSessionRepository = new ChatSessionRepository();
    this.messageRepository = new MessageRepository();
  }

  async createSession(): Promise<ChatSessionResponseDTO> {
    const customerId = uuidv4();
    const session = await this.chatSessionRepository.create({ customerId });
    return this.toResponseDTO(session);
  }

  async getSession(sessionId: string): Promise<ChatSessionResponseDTO | null> {
    const session = await this.chatSessionRepository.findById(sessionId);
    return session ? this.toResponseDTO(session) : null;
  }

  async getAllSessions(): Promise<ChatSessionResponseDTO[]> {
    const sessions = await this.chatSessionRepository.findAll();
    return sessions.map((s) => this.toResponseDTO(s));
  }

  async updateStatus(
    sessionId: string,
    data: UpdateChatSessionStatusDTO
  ): Promise<ChatSessionResponseDTO | null> {
    const session = await this.chatSessionRepository.updateStatus(sessionId, data);
    return session ? this.toResponseDTO(session) : null;
  }

  async createMessage(
    sessionId: string,
    data: CreateMessageDTO
  ): Promise<MessageResponseDTO> {
    const session = await this.chatSessionRepository.findById(sessionId);
    if (!session) {
      throw new Error('Chat session not found');
    }

    const message = await this.messageRepository.create({
      ...data,
      chatSessionId: new mongoose.Types.ObjectId(sessionId),
    });

    return this.messageToResponseDTO(message);
  }

  async getMessages(sessionId: string): Promise<MessageResponseDTO[]> {
    const messages = await this.messageRepository.findBySessionId(sessionId);
    return messages.map((m) => this.messageToResponseDTO(m));
  }

  private toResponseDTO(session: any): ChatSessionResponseDTO {
    return {
      _id: session._id.toString(),
      customerId: session.customerId,
      status: session.status,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }

  private messageToResponseDTO(message: any): MessageResponseDTO {
    return {
      _id: message._id.toString(),
      chatSessionId: message.chatSessionId.toString(),
      sender: message.sender,
      content: message.content,
      timestamp: message.timestamp.toISOString(),
    };
  }
}

