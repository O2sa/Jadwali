import { SchoolConfigModel } from '../models/SchoolConfig.model.js';
import { TeacherModel } from '../models/Teacher.model.js';
import { ClassModel } from '../models/Class.model.js';
import { SubjectModel } from '../models/Subject.model.js';
import { CurriculumModel } from '../models/Curriculum.model.js';
import { ScheduleModel } from '../models/Schedule.model.js';
import type { SchoolBackupPayload } from '../types/domain.js';

export async function exportSchoolBackup(): Promise<SchoolBackupPayload> {
  const [configDoc, teachers, classes, subjects, curriculum, schedules] = await Promise.all([
    SchoolConfigModel.findOne(),
    TeacherModel.find(),
    ClassModel.find(),
    SubjectModel.find(),
    CurriculumModel.find(),
    ScheduleModel.find()
  ]);

  const config = configDoc ? configDoc.toJSON() : (await SchoolConfigModel.create({})).toJSON();

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    config,
    teachers: teachers.map((t) => t.toJSON()),
    classes: classes.map((c) => c.toJSON()),
    subjects: subjects.map((s) => s.toJSON()),
    curriculum: curriculum.map((c) => c.toJSON()),
    schedules: schedules.map((s) => s.toJSON())
  };
}

export async function importSchoolBackup(payload: Partial<SchoolBackupPayload>): Promise<void> {
  // Wipe current state
  await Promise.all([
    SchoolConfigModel.deleteMany({}),
    TeacherModel.deleteMany({}),
    ClassModel.deleteMany({}),
    SubjectModel.deleteMany({}),
    CurriculumModel.deleteMany({}),
    ScheduleModel.deleteMany({})
  ]);

  // Insert imported state
  await Promise.all([
    payload.config ? SchoolConfigModel.create(payload.config) : SchoolConfigModel.create({}),
    payload.teachers?.length ? TeacherModel.insertMany(payload.teachers) : Promise.resolve([]),
    payload.classes?.length ? ClassModel.insertMany(payload.classes) : Promise.resolve([]),
    payload.subjects?.length ? SubjectModel.insertMany(payload.subjects) : Promise.resolve([]),
    payload.curriculum?.length ? CurriculumModel.insertMany(payload.curriculum) : Promise.resolve([]),
    payload.schedules?.length ? ScheduleModel.insertMany(payload.schedules) : Promise.resolve([])
  ]);
}
