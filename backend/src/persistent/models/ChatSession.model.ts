import mongoose, { Schema, Document } from 'mongoose';

export interface IChatSession extends Document {
  customerId: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  deletedAt?: Date;
  deletedBy?: string;
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
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
    deletedBy: {
      type: String,
      default: null,
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




