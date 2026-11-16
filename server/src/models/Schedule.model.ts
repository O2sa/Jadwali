import mongoose, { Schema, Document } from 'mongoose';
import { nanoid } from 'nanoid';
import type { SavedScheduleRecord } from '../types/domain.js';

export interface ScheduleDocument extends Document, Omit<SavedScheduleRecord, 'id'> {
  id: string;
}

const transform = (_doc: unknown, ret: Record<string, any>) => {
  delete ret._id;
  delete ret.__v;
  return ret;
};

const ScheduleSchema = new Schema<ScheduleDocument>(
  {
    id: { type: String, required: true, unique: true, default: () => `sched_${nanoid(8)}` },
    name: { type: String, required: true },
    createdAt: { type: String, required: true, default: () => new Date().toISOString() },
    isActive: { type: Boolean, required: true, default: false, index: true },
    status: {
      type: String,
      required: true,
      enum: ['solved', 'unsat', 'timeout'],
      default: 'solved'
    },
    solveTimeMs: { type: Number, required: true, default: 0 },
    backtrackCount: { type: Number, required: true, default: 0 },
    assignments: [
      {
        lectureId: { type: String, required: true },
        classId: { type: String, required: true },
        teacherId: { type: String, required: true },
        subjectId: { type: String, required: true },
        dayIndex: { type: Number, required: true },
        periodIndex: { type: Number, required: true },
        roomNumber: { type: String, required: true },
        _id: false
      }
    ]
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    toJSON: { transform },
    toObject: { transform }
  }
);

export const ScheduleModel = mongoose.model<ScheduleDocument>('Schedule', ScheduleSchema);
