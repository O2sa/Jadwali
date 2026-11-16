import mongoose, { Schema, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import type { SubjectRecord } from '../types/domain.js';

export interface SubjectDocument extends Document, Omit<SubjectRecord, 'id'> {
  id: string;
}

const SubjectSchema = new Schema<SubjectDocument>(
  {
    id: { type: String, required: true, unique: true, default: () => `subj_${nanoid(8)}` },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['core', 'science', 'humanities', 'activity'],
      default: 'core'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: unknown, ret: Record<string, any>) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const SubjectModel = mongoose.model<SubjectDocument>('Subject', SubjectSchema);
