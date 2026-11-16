import { z } from 'zod';

export const saveSchoolConfigSchema = z.object({
  body: z.object({
    config: z.object({
      schoolName: z.string().optional(),
      academicYear: z.string().optional(),
      term: z.string().optional(),
      workingDays: z.array(z.number()).optional(),
      periodsPerDayDefault: z.number().optional(),
      gradePeriodsConfig: z.record(z.string(), z.number()).optional()
    })
  })
});
