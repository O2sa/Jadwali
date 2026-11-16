import mongoose, { Schema, Document } from 'mongoose';
import type { SchoolConfigRecord } from '../types/domain.js';

export interface SchoolConfigDocument extends Document, Omit<SchoolConfigRecord, 'gradePeriodsConfig'> {
  gradePeriodsConfig: Map<string, number>;
}

const transform = (_doc: unknown, ret: Record<string, any>) => {
  delete ret._id;
  delete ret.__v;
  if (ret.gradePeriodsConfig instanceof Map) {
    ret.gradePeriodsConfig = Object.fromEntries(ret.gradePeriodsConfig);
  }
  return ret;
};

const SchoolConfigSchema = new Schema<SchoolConfigDocument>(
  {
    schoolName: { type: String, required: true, default: 'Jadwali School' },
    academicYear: { type: String, required: true, default: '2026/2027' },
    term: { type: String, required: true, default: 'First Term' },
    workingDays: { type: [Number], required: true, default: [0, 1, 2, 3, 4] },
    periodsPerDayDefault: { type: Number, required: true, default: 7 },
    gradePeriodsConfig: {
      type: Map,
      of: Number,
      default: () => new Map<string, number>([
        ['1', 6], ['2', 6], ['3', 6], ['4', 6], ['5', 7], ['6', 7],
        ['7', 7], ['8', 7], ['9', 7], ['10', 7], ['11', 7], ['12', 7]
      ])
    }
  },
  {
    timestamps: true,
    toJSON: { transform },
    toObject: { transform }
  }
);

export const SchoolConfigModel = mongoose.model<SchoolConfigDocument>('SchoolConfig', SchoolConfigSchema);
