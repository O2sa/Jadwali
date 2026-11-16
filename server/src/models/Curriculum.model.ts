import mongoose, { Schema, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import type { CurriculumRequirementRecord } from '../types/domain.js';

export interface CurriculumDocument extends Document, Omit<CurriculumRequirementRecord, 'id'> {
  id: string;
}

const transform = (_doc: unknown, ret: Record<string, any>) => {
  delete ret._id;
  delete ret.__v;
  return ret;
};

const CurriculumSchema = new Schema<CurriculumDocument>(
  {
    id: { type: String, required: true, unique: true, default: () => `curr_${nanoid(8)}` },
    classId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    teacherId: { type: String, required: true, index: true },
    periodsPerWeek: { type: Number, required: true, min: 1 }
  },
  {
    timestamps: true,
    toJSON: { transform },
    toObject: { transform }
  }
);

export const CurriculumModel = mongoose.model<CurriculumDocument>('Curriculum', CurriculumSchema);
