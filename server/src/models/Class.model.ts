import mongoose, { Schema, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import type { ClassRecord } from '../types/domain.js';

export interface ClassDocument extends Document, Omit<ClassRecord, 'id'> {
  id: string;
}

const transform = (_doc: unknown, ret: Record<string, any>) => {
  delete ret._id;
  delete ret.__v;
  return ret;
};

const ClassSchema = new Schema<ClassDocument>(
  {
    id: { type: String, required: true, unique: true, default: () => `cls_${nanoid(8)}` },
    gradeLevel: { type: Number, required: true, min: 1, max: 12 },
    roomNumber: { type: String, required: true, trim: true },
    sectionName: { type: String, required: true, trim: true },
    periodsPerDay: { type: Number, required: true, default: 7 }
  },
  {
    timestamps: true,
    toJSON: { transform },
    toObject: { transform }
  }
);

export const ClassModel = mongoose.model<ClassDocument>('Class', ClassSchema);
