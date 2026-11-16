import mongoose, { Schema, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import type { TeacherRecord } from '../types/domain.js';

export interface TeacherDocument extends Document, Omit<TeacherRecord, 'id'> {
  id: string;
}

const TeacherSchema = new Schema<TeacherDocument>(
  {
    id: { type: String, required: true, unique: true, default: () => `teach_${nanoid(8)}` },
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    maxDailyPeriods: { type: Number, required: true, default: 5 },
    maxWeeklyPeriods: { type: Number, required: true, default: 24 },
    unavailableSlots: [
      {
        dayIndex: { type: Number, required: true },
        periodIndex: { type: Number, required: true },
        _id: false
      }
    ]
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

export const TeacherModel = mongoose.model<TeacherDocument>('Teacher', TeacherSchema);
