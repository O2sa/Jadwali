import {
  solveTimetable,
  type TimetableInput,
  type SolverOptions as EngineSolverOptions,
  type ScheduledLecture
} from 'school-timetabling-engine';
import { ScheduleModel } from '../models/Schedule.model.js';
import { SchoolConfigModel } from '../models/SchoolConfig.model.js';
import { TeacherModel } from '../models/Teacher.model.js';
import { ClassModel } from '../models/Class.model.js';
import { SubjectModel } from '../models/Subject.model.js';
import { CurriculumModel } from '../models/Curriculum.model.js';
import type { SavedScheduleRecord, TimetableAssignment } from '../types/domain.js';

export interface GenerateScheduleOptions {
  timeoutMs?: number;
  maxBacktracks?: number;
  maxIterations?: number;
  seed?: number;
  randomSeed?: number;
  name?: string;
  [key: string]: unknown;
}

export async function generateScheduleServer(
  options?: GenerateScheduleOptions
): Promise<SavedScheduleRecord> {
  const [config, teachers, classes, subjects, curriculum] = await Promise.all([
    SchoolConfigModel.findOne(),
    TeacherModel.find(),
    ClassModel.find(),
    SubjectModel.find(),
    CurriculumModel.find()
  ]);

  const workingDays =
    config?.workingDays && config.workingDays.length > 0
      ? config.workingDays
      : [0, 1, 2, 3, 4];
  const periodsPerDay = config?.periodsPerDayDefault ?? 7;

  const days = workingDays.map((id) => ({ id }));
  const totalWorkingDays = days.length;

  // Calculate total curriculum demand per class to align with engine's exact lecture count requirement
  const classCurriculumSum = new Map<string, number>();
  for (const c of curriculum) {
    classCurriculumSum.set(
      c.classId,
      (classCurriculumSum.get(c.classId) ?? 0) + c.periodsPerWeek
    );
  }

  const classDefs = classes.map((c) => {
    const totalReq = classCurriculumSum.get(c.id) ?? 0;
    let lecturesPerDay: number;
    if (totalWorkingDays > 0 && totalReq > 0 && totalReq % totalWorkingDays === 0) {
      lecturesPerDay = totalReq / totalWorkingDays;
    } else if (totalReq === 0) {
      lecturesPerDay = 0;
    } else {
      lecturesPerDay = c.periodsPerDay || periodsPerDay;
    }

    return {
      id: c.id,
      name: c.sectionName || c.id,
      lecturesPerDay
    };
  });

  const teacherDefs = teachers.map((t) => ({
    id: t.id,
    name: t.name,
    workingDays,
    blockedSlots:
      t.unavailableSlots?.map((s) => ({
        day: s.dayIndex,
        period: s.periodIndex
      })) ?? [],
    maxLecturesPerDay: t.maxDailyPeriods
  }));

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const requirements = curriculum.map((c) => ({
    id: c.id,
    teacherId: c.teacherId,
    classId: c.classId,
    subjectId: c.subjectId,
    subjectName: subjectMap.get(c.subjectId),
    lecturesPerWeek: c.periodsPerWeek
  }));

  const engineOptions: EngineSolverOptions = {
    timeoutMs: options?.timeoutMs,
    maxBacktracks: options?.maxBacktracks,
    maxIterations: options?.maxIterations,
    seed: options?.seed ?? options?.randomSeed
  };

  const input: TimetableInput = {
    days,
    periodsPerDay,
    classes: classDefs,
    teachers: teacherDefs,
    requirements,
    options: engineOptions
  };

  const result = solveTimetable(input);

  const classRoomMap = new Map(classes.map((c) => [c.id, c.roomNumber || '']));

  let status: 'solved' | 'unsat' | 'timeout' = 'solved';
  let rawLectures: ScheduledLecture[] = [];

  if (result.status === 'SUCCESS') {
    status = 'solved';
    rawLectures = result.lectures;
  } else if (result.status === 'TIMEOUT') {
    status = 'timeout';
    rawLectures = result.partialLectures;
  } else {
    status = 'unsat';
    rawLectures = [];
  }

  const assignments: TimetableAssignment[] = rawLectures.map((l) => ({
    lectureId: `${l.classId}__${l.day}__${l.period}`,
    classId: l.classId,
    teacherId: l.teacherId,
    subjectId: l.subjectId || '',
    dayIndex: l.day,
    periodIndex: l.period,
    roomNumber: classRoomMap.get(l.classId) || 'Unassigned'
  }));

  await ScheduleModel.updateMany({ isActive: true }, { $set: { isActive: false } });

  const scheduleDoc = await ScheduleModel.create({
    name: options?.name || `Schedule ${new Date().toISOString()}`,
    status,
    solveTimeMs: result.statistics?.executionTimeMs ?? 0,
    backtrackCount: result.statistics?.backtracks ?? 0,
    isActive: true,
    assignments
  });

  return scheduleDoc.toJSON() as SavedScheduleRecord;
}
