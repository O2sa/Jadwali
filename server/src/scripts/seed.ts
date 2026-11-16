import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { importSchoolBackup } from '../services/backup.service.js';

export const demoBackup = {
  version: 1,
  exportedAt: new Date().toISOString(),
  config: {
    schoolName: 'مدرسة جَدْوَلي التجريبية (Jadwali Model School)',
    academicYear: '2026/2027',
    term: 'الفصل الدراسي الأول',
    workingDays: [0, 1, 2, 3, 4],
    periodsPerDayDefault: 7,
    gradePeriodsConfig: {
      1: 6, 2: 6, 3: 6, 4: 6, 5: 7, 6: 7, 7: 7, 8: 7, 9: 7, 10: 7, 11: 7, 12: 7
    }
  },
  teachers: [
    { id: 't1', name: 'أ. محمد القحطاني', specialization: 'رياضيات', maxDailyPeriods: 5, maxWeeklyPeriods: 20, unavailableSlots: [] },
    { id: 't2', name: 'أ. خالد الشمري', specialization: 'فيزياء', maxDailyPeriods: 5, maxWeeklyPeriods: 20, unavailableSlots: [] },
    { id: 't3', name: 'أ. عبد الله الدوسري', specialization: 'لغة عربية', maxDailyPeriods: 5, maxWeeklyPeriods: 22, unavailableSlots: [] },
    { id: 't4', name: 'أ. عمر السعيد', specialization: 'لغة إنجليزية', maxDailyPeriods: 5, maxWeeklyPeriods: 20, unavailableSlots: [] },
    { id: 't5', name: 'أ. سلطان العتيبي', specialization: 'كيمياء', maxDailyPeriods: 5, maxWeeklyPeriods: 18, unavailableSlots: [] }
  ],
  classes: [
    { id: 'c1', gradeLevel: 10, roomNumber: '101', sectionName: '10/أ', periodsPerDay: 7 },
    { id: 'c2', gradeLevel: 10, roomNumber: '102', sectionName: '10/ب', periodsPerDay: 7 },
    { id: 'c3', gradeLevel: 11, roomNumber: '201', sectionName: '11/علمي', periodsPerDay: 7 }
  ],
  subjects: [
    { id: 's1', name: 'رياضيات', code: 'MATH', category: 'core' as const },
    { id: 's2', name: 'فيزياء', code: 'PHYS', category: 'science' as const },
    { id: 's3', name: 'لغة عربية', code: 'ARAB', category: 'core' as const },
    { id: 's4', name: 'لغة إنجليزية', code: 'ENG', category: 'humanities' as const },
    { id: 's5', name: 'كيمياء', code: 'CHEM', category: 'science' as const }
  ],
  curriculum: [
    { id: 'cur1', classId: 'c1', subjectId: 's1', teacherId: 't1', periodsPerWeek: 5 },
    { id: 'cur2', classId: 'c1', subjectId: 's2', teacherId: 't2', periodsPerWeek: 4 },
    { id: 'cur3', classId: 'c1', subjectId: 's3', teacherId: 't3', periodsPerWeek: 5 },
    { id: 'cur4', classId: 'c1', subjectId: 's4', teacherId: 't4', periodsPerWeek: 4 },
    { id: 'cur5', classId: 'c2', subjectId: 's1', teacherId: 't1', periodsPerWeek: 5 },
    { id: 'cur6', classId: 'c3', subjectId: 's5', teacherId: 't5', periodsPerWeek: 4 }
  ],
  schedules: []
};

export async function seed(): Promise<void> {
  console.log('Starting Jadwali School Database Seeding...');
  await connectDatabase();
  await importSchoolBackup(demoBackup);
  console.log('Seeding completed successfully!');
  await disconnectDatabase();
}

// Execute when run directly as CLI
const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith('seed.ts') ||
   process.argv[1].endsWith('seed.js') ||
   process.argv[1].includes('seed'));

if (isDirectRun) {
  seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}
