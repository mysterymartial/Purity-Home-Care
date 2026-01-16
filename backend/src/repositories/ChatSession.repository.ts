import { ChatSessionModel, IChatSession } from '../persistent/models/ChatSession.model';
import { CreateChatSessionDTO, UpdateChatSessionStatusDTO } from '../dto/ChatSession.dto';

export class ChatSessionRepository {
  async create(data: CreateChatSessionDTO): Promise<IChatSession> {
    const session = new ChatSessionModel(data);
    return await session.save();
  }

  async findById(id: string): Promise<IChatSession | null> {
    return await ChatSessionModel.findById(id);
  }

  async findByCustomerId(customerId: string): Promise<IChatSession | null> {
    return await ChatSessionModel.findOne({ customerId });
  }

  async findAll(): Promise<IChatSession[]> {
    return await ChatSessionModel.find().sort({ updatedAt: -1 });
  }

  async updateStatus(
    id: string,
    data: UpdateChatSessionStatusDTO
  ): Promise<IChatSession | null> {
    return await ChatSessionModel.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await ChatSessionModel.findByIdAndDelete(id);
    return !!result;
  }
}




