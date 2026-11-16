import { z } from 'zod';

export const createSubjectSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required'),
    category: z.enum(['core', 'science', 'humanities', 'activity']).optional()
  })
});

export const updateSubjectSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    id: z.string().optional(),
    name: z.string().min(1).optional(),
    code: z.string().min(1).optional(),
    category: z.enum(['core', 'science', 'humanities', 'activity']).optional()
  })
});

export const deleteSubjectSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
