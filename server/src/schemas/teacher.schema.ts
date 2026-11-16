import { z } from 'zod';

const unavailableSlotSchema = z.object({
  dayIndex: z.number().int().min(0),
  periodIndex: z.number().int().min(0)
});

export const createTeacherSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    specialization: z.string().min(1, 'Specialization is required'),
    maxDailyPeriods: z.number().int().min(1).optional(),
    maxWeeklyPeriods: z.number().int().min(1).optional(),
    unavailableSlots: z.array(unavailableSlotSchema).optional()
  })
});

export const updateTeacherSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    id: z.string().optional(),
    name: z.string().min(1).optional(),
    specialization: z.string().min(1).optional(),
    maxDailyPeriods: z.number().int().min(1).optional(),
    maxWeeklyPeriods: z.number().int().min(1).optional(),
    unavailableSlots: z.array(unavailableSlotSchema).optional()
  })
});

export const deleteTeacherSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
