import { z } from 'zod';

const assignmentSchema = z.object({
  lectureId: z.string().min(1),
  classId: z.string().min(1),
  teacherId: z.string().min(1),
  subjectId: z.string(),
  dayIndex: z.number().int().min(0),
  periodIndex: z.number().int().min(0),
  roomNumber: z.string()
});

export const createScheduleSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    createdAt: z.string().optional(),
    isActive: z.boolean().optional(),
    status: z.enum(['solved', 'unsat', 'timeout']).optional(),
    solveTimeMs: z.number().optional(),
    backtrackCount: z.number().optional(),
    assignments: z.array(assignmentSchema)
  })
});

export const scheduleIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

export const generateScheduleSchema = z.object({
  body: z
    .object({
      options: z
        .object({
          timeoutMs: z.number().positive().optional(),
          maxBacktracks: z.number().positive().optional(),
          maxIterations: z.number().positive().optional(),
          seed: z.number().optional(),
          randomSeed: z.number().optional(),
          name: z.string().optional()
        })
        .passthrough()
        .optional()
    })
    .optional()
});
