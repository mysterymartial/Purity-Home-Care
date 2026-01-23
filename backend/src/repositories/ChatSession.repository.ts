import { ChatSessionModel, IChatSession } from '../persistent/models/ChatSession.model';
import { CreateChatSessionDTO, UpdateChatSessionStatusDTO } from '../dto/ChatSession.dto';

export class ChatSessionRepository {
  async create(data: CreateChatSessionDTO): Promise<IChatSession> {
    const session = new ChatSessionModel(data);
    return await session.save();
  }

  async findById(id: string): Promise<IChatSession | null> {
    return await ChatSessionModel.findOne({ _id: id, deletedAt: null });
  }

  async findByCustomerId(customerId: string): Promise<IChatSession | null> {
    return await ChatSessionModel.findOne({ customerId, deletedAt: null });
  }

  async findAll(): Promise<IChatSession[]> {
    return await ChatSessionModel.find({ deletedAt: null }).sort({ updatedAt: -1 });
  }

  async updateStatus(
    id: string,
    data: UpdateChatSessionStatusDTO
  ): Promise<IChatSession | null> {
    return await ChatSessionModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { status: data.status },
      { new: true }
    );
  }

  async softDelete(id: string, deletedBy: string): Promise<boolean> {
    const result = await ChatSessionModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { 
        deletedAt: new Date(),
        deletedBy: deletedBy
      },
      { new: true }
    );
    return !!result;
  }
}




