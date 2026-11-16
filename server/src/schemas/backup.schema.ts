import { z } from 'zod';

export const importBackupSchema = z.object({
  body: z.object({
    version: z.number().optional(),
    exportedAt: z.string().optional(),
    config: z.any().optional(),
    teachers: z.array(z.any()).optional(),
    classes: z.array(z.any()).optional(),
    subjects: z.array(z.any()).optional(),
    curriculum: z.array(z.any()).optional(),
    schedules: z.array(z.any()).optional()
  })
});
