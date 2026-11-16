import { z } from 'zod';

export const createCurriculumSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    classId: z.string().min(1, 'Class ID is required'),
    subjectId: z.string().min(1, 'Subject ID is required'),
    teacherId: z.string().min(1, 'Teacher ID is required'),
    periodsPerWeek: z.number().int().min(1, 'Periods per week must be at least 1')
  })
});

export const updateCurriculumSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    id: z.string().optional(),
    classId: z.string().min(1).optional(),
    subjectId: z.string().min(1).optional(),
    teacherId: z.string().min(1).optional(),
    periodsPerWeek: z.number().int().min(1).optional()
  })
});

export const deleteCurriculumSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
