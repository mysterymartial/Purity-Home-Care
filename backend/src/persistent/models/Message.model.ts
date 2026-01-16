import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chatSessionId: mongoose.Types.ObjectId;
  sender: 'customer' | 'admin';
  content: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatSessionId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ['customer', 'admin'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);




