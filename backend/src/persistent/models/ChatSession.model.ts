import mongoose, { Schema, Document } from 'mongoose';

export interface IChatSession extends Document {
  customerId: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

export const ChatSessionModel = mongoose.model<IChatSession>(
  'ChatSession',
  ChatSessionSchema
);

