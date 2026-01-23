import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalSettings extends Document {
  theme: 'light' | 'dark' | 'auto';
  updatedAt: Date;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>(
  {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one document exists
GlobalSettingsSchema.index({}, { unique: true });

export const GlobalSettingsModel = mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
