import { z } from 'zod';

export const createClassSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    gradeLevel: z.number().int().min(1).max(12),
    roomNumber: z.string().min(1, 'Room number is required'),
    sectionName: z.string().min(1, 'Section name is required'),
    periodsPerDay: z.number().int().min(1).optional()
  })
});

export const updateClassSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    id: z.string().optional(),
    gradeLevel: z.number().int().min(1).max(12).optional(),
    roomNumber: z.string().min(1).optional(),
    sectionName: z.string().min(1).optional(),
    periodsPerDay: z.number().int().min(1).optional()
  })
});

export const deleteClassSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
