import { v4 as uuidv4 } from 'uuid';
import { ChatSessionRepository } from '../repositories/ChatSession.repository';
import { MessageRepository } from '../repositories/Message.repository';
import { CreateChatSessionDTO, UpdateChatSessionStatusDTO, ChatSessionResponseDTO } from '../dto/ChatSession.dto';
import { CreateMessageDTO, MessageResponseDTO } from '../dto/Message.dto';
import mongoose from 'mongoose';
import { EmailService } from './Email.service';

export class ChatSessionService {
  private chatSessionRepository: ChatSessionRepository;
  private messageRepository: MessageRepository;
  private emailService: EmailService;

  constructor() {
    this.chatSessionRepository = new ChatSessionRepository();
    this.messageRepository = new MessageRepository();
    this.emailService = new EmailService();
  }

  async createSession(): Promise<ChatSessionResponseDTO> {
    const customerId = uuidv4();
    const session = await this.chatSessionRepository.create({ customerId });
    
    // Send email notification for new chat session
    this.emailService.sendNewChatNotification(session._id.toString(), customerId).catch(err => {
      console.error('Failed to send new chat notification:', err);
    });
    
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

    // Send email notification if message is from customer
    if (data.sender === 'customer') {
      this.emailService.sendNewMessageNotification(
        sessionId,
        session.customerId,
        data.content
      ).catch(err => {
        console.error('Failed to send new message notification:', err);
      });
    }

    return this.messageToResponseDTO(message);
  }

  async getMessages(sessionId: string): Promise<MessageResponseDTO[]> {
    const messages = await this.messageRepository.findBySessionId(sessionId);
    return messages.map((m) => this.messageToResponseDTO(m));
  }

  async deleteSession(sessionId: string, deletedBy: string): Promise<boolean> {
    // First soft delete all messages associated with this session
    await this.messageRepository.softDeleteBySessionId(sessionId);
    
    // Then soft delete the session itself
    const deleted = await this.chatSessionRepository.softDelete(sessionId, deletedBy);
    return deleted;
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




