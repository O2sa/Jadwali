export interface UnavailableSlot {
  dayIndex: number;
  periodIndex: number;
}

export interface TeacherRecord {
  id: string;
  name: string;
  specialization: string;
  maxDailyPeriods: number;
  maxWeeklyPeriods: number;
  unavailableSlots: UnavailableSlot[];
}

export interface ClassRecord {
  id: string;
  gradeLevel: number;
  roomNumber: string;
  sectionName: string;
  periodsPerDay: number;
}

export interface SubjectRecord {
  id: string;
  name: string;
  code: string;
  category: 'core' | 'science' | 'humanities' | 'activity';
}

export interface CurriculumRequirementRecord {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  periodsPerWeek: number;
}

export interface SchoolConfigRecord {
  schoolName: string;
  academicYear: string;
  term: string;
  workingDays: number[];
  periodsPerDayDefault: number;
  gradePeriodsConfig: Record<number, number>;
}

export interface TimetableAssignment {
  lectureId: string;
  classId: string;
  teacherId: string;
  subjectId: string;
  dayIndex: number;
  periodIndex: number;
  roomNumber: string;
}

export interface SavedScheduleRecord {
  id: string;
  createdAt: string;
  name: string;
  isActive: boolean;
  status: 'solved' | 'unsat' | 'timeout';
  solveTimeMs: number;
  backtrackCount: number;
  assignments: TimetableAssignment[];
}

export interface SolverProgress {
  step: number;
  assignedCount: number;
  totalLectures: number;
  backtracks: number;
  elapsedMs: number;
}

export interface SchoolBackupPayload {
  version: number;
  exportedAt: string;
  config: SchoolConfigRecord;
  teachers: TeacherRecord[];
  classes: ClassRecord[];
  subjects: SubjectRecord[];
  curriculum: CurriculumRequirementRecord[];
  schedules: SavedScheduleRecord[];
}

export interface SolverOptions {
  timeoutMs?: number;
  randomSeed?: number;
}
