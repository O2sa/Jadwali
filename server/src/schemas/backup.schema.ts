import { z } from 'zod';

const backupUnavailableSlotSchema = z.object({
  dayIndex: z.number().int().min(0),
  periodIndex: z.number().int().min(0)
});

const backupTeacherSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    specialization: z.string().min(1, 'Specialization is required'),
    maxDailyPeriods: z.number().int().min(1).optional(),
    maxWeeklyPeriods: z.number().int().min(1).optional(),
    unavailableSlots: z.array(backupUnavailableSlotSchema).optional()
  })
  .passthrough();

const backupClassSchema = z
  .object({
    id: z.string().optional(),
    gradeLevel: z.number().int().min(1).max(12),
    roomNumber: z.string().min(1, 'Room number is required'),
    sectionName: z.string().min(1, 'Section name is required'),
    periodsPerDay: z.number().int().min(1).optional()
  })
  .passthrough();

const backupSubjectSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
    category: z.enum(['core', 'science', 'humanities', 'activity']).optional()
  })
  .passthrough();

const backupCurriculumSchema = z
  .object({
    id: z.string().optional(),
    classId: z.string().min(1, 'Class ID is required'),
    subjectId: z.string().min(1, 'Subject ID is required'),
    teacherId: z.string().min(1, 'Teacher ID is required'),
    periodsPerWeek: z.number().int().min(1)
  })
  .passthrough();

const backupAssignmentSchema = z
  .object({
    lectureId: z.string().min(1),
    classId: z.string().min(1),
    teacherId: z.string().min(1),
    subjectId: z.string().min(1),
    dayIndex: z.number().int().min(0),
    periodIndex: z.number().int().min(0),
    roomNumber: z.string()
  })
  .passthrough();

const backupScheduleSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    createdAt: z.string().optional(),
    isActive: z.boolean().optional(),
    status: z.enum(['solved', 'unsat', 'timeout']).optional(),
    solveTimeMs: z.number().optional(),
    backtrackCount: z.number().optional(),
    assignments: z.array(backupAssignmentSchema).optional()
  })
  .passthrough();

const backupConfigSchema = z
  .object({
    schoolName: z.string().optional(),
    academicYear: z.string().optional(),
    term: z.string().optional(),
    workingDays: z.array(z.number()).optional(),
    periodsPerDayDefault: z.number().optional(),
    gradePeriodsConfig: z.record(z.union([z.string(), z.number()]), z.number()).optional()
  })
  .passthrough();

export const importBackupSchema = z.object({
  body: z.object({
    version: z.number().optional(),
    exportedAt: z.string().optional(),
    config: backupConfigSchema.optional(),
    teachers: z.array(backupTeacherSchema).optional(),
    classes: z.array(backupClassSchema).optional(),
    subjects: z.array(backupSubjectSchema).optional(),
    curriculum: z.array(backupCurriculumSchema).optional(),
    schedules: z.array(backupScheduleSchema).optional()
  })
});
