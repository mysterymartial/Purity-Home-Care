import { MessageModel, IMessage } from '../persistent/models/Message.model';
import { CreateMessageDTO } from '../dto/Message.dto';
import mongoose from 'mongoose';

export class MessageRepository {
  async create(data: CreateMessageDTO & { chatSessionId: mongoose.Types.ObjectId }): Promise<IMessage> {
    const message = new MessageModel(data);
    return await message.save();
  }

  async findBySessionId(sessionId: string): Promise<IMessage[]> {
    return await MessageModel.find({
      chatSessionId: new mongoose.Types.ObjectId(sessionId),
    }).sort({ timestamp: 1 });
  }

  async findById(id: string): Promise<IMessage | null> {
    return await MessageModel.findById(id);
  }

  async deleteBySessionId(sessionId: string): Promise<void> {
    await MessageModel.deleteMany({
      chatSessionId: new mongoose.Types.ObjectId(sessionId),
    });
  }
}




