import { describe, it, expect } from 'vitest';
import { TeacherModel } from '../src/models/Teacher.model.js';
import { SchoolConfigModel } from '../src/models/SchoolConfig.model.js';
import { ClassModel } from '../src/models/Class.model.js';
import { SubjectModel } from '../src/models/Subject.model.js';
import { CurriculumModel } from '../src/models/Curriculum.model.js';
import { ScheduleModel } from '../src/models/Schedule.model.js';
import type { SolverProgress } from '../src/types/domain.js';

describe('Mongoose Domain Models', () => {
  it('creates and serializes a Teacher with string id and no __v', async () => {
    const teacher = await TeacherModel.create({
      id: 'teach_1',
      name: 'Ahmed Mansoor',
      specialization: 'Mathematics',
      maxDailyPeriods: 5,
      maxWeeklyPeriods: 20,
      unavailableSlots: [{ dayIndex: 0, periodIndex: 1 }]
    });

    const json = teacher.toJSON();
    expect(json.id).toBe('teach_1');
    expect(json._id).toBeUndefined();
    expect(json.__v).toBeUndefined();
    expect(json.name).toBe('Ahmed Mansoor');

    const obj = teacher.toObject();
    expect(obj.id).toBe('teach_1');
    expect(obj._id).toBeUndefined();
    expect(obj.__v).toBeUndefined();
  });

  it('creates and serializes a Class record', async () => {
    const cls = await ClassModel.create({
      id: 'cls_1',
      gradeLevel: 1,
      roomNumber: '101',
      sectionName: '1/A',
      periodsPerDay: 6
    });
    const json = cls.toJSON();
    expect(json.id).toBe('cls_1');
    expect(json.gradeLevel).toBe(1);
    expect(json._id).toBeUndefined();
    expect(json.__v).toBeUndefined();

    const obj = cls.toObject();
    expect(obj.id).toBe('cls_1');
    expect(obj._id).toBeUndefined();
    expect(obj.__v).toBeUndefined();
  });

  it('creates and serializes all remaining models cleanly with toJSON and toObject', async () => {
    const config = await SchoolConfigModel.create({});
    const configJson = config.toJSON();
    expect(configJson.schoolName).toBe('Jadwali School');
    expect(configJson._id).toBeUndefined();
    expect(configJson.__v).toBeUndefined();
    expect(typeof configJson.gradePeriodsConfig).toBe('object');
    expect(configJson.gradePeriodsConfig[1] ?? configJson.gradePeriodsConfig['1']).toBe(6);

    const configObj = config.toObject();
    expect(configObj._id).toBeUndefined();
    expect(configObj.__v).toBeUndefined();
    expect(typeof configObj.gradePeriodsConfig).toBe('object');
    expect(configObj.gradePeriodsConfig[1] ?? configObj.gradePeriodsConfig['1']).toBe(6);

    const subject = await SubjectModel.create({
      id: 'subj_1',
      name: 'Math',
      code: 'MATH',
      category: 'core'
    });
    const subjJson = subject.toJSON();
    expect(subjJson.name).toBe('Math');
    expect(subjJson._id).toBeUndefined();
    expect(subjJson.__v).toBeUndefined();

    const subjObj = subject.toObject();
    expect(subjObj._id).toBeUndefined();
    expect(subjObj.__v).toBeUndefined();

    const curriculum = await CurriculumModel.create({
      id: 'curr_1',
      classId: 'cls_1',
      subjectId: 'subj_1',
      teacherId: 'teach_1',
      periodsPerWeek: 5
    });
    const currJson = curriculum.toJSON();
    expect(currJson.periodsPerWeek).toBe(5);
    expect(currJson._id).toBeUndefined();
    expect(currJson.__v).toBeUndefined();

    const currObj = curriculum.toObject();
    expect(currObj._id).toBeUndefined();
    expect(currObj.__v).toBeUndefined();

    const schedule = await ScheduleModel.create({
      id: 'sched_1',
      name: 'Test Schedule',
      status: 'solved',
      assignments: [
        {
          lectureId: 'lec_1',
          classId: 'cls_1',
          teacherId: 'teach_1',
          subjectId: 'subj_1',
          dayIndex: 0,
          periodIndex: 0,
          roomNumber: '101'
        }
      ]
    });
    const schedJson = schedule.toJSON();
    expect(schedJson.status).toBe('solved');
    expect(schedJson.assignments).toHaveLength(1);
    expect(schedJson.assignments[0]._id).toBeUndefined();
    expect(schedJson._id).toBeUndefined();
    expect(schedJson.__v).toBeUndefined();
    expect(typeof schedJson.createdAt).toBe('string');

    const schedObj = schedule.toObject();
    expect(schedObj.status).toBe('solved');
    expect(schedObj._id).toBeUndefined();
    expect(schedObj.__v).toBeUndefined();
    expect(typeof schedObj.createdAt).toBe('string');
  });

  it('generates nanoid-based string IDs if id is omitted', async () => {
    const teacher = await TeacherModel.create({
      name: 'Sara Khan',
      specialization: 'Physics'
    });
    expect(teacher.id).toMatch(/^teach_/);

    const cls = await ClassModel.create({
      gradeLevel: 2,
      roomNumber: '102',
      sectionName: '2/B'
    });
    expect(cls.id).toMatch(/^cls_/);

    const subject = await SubjectModel.create({
      name: 'Physics',
      code: 'PHYS'
    });
    expect(subject.id).toMatch(/^subj_/);

    const curriculum = await CurriculumModel.create({
      classId: cls.id,
      subjectId: subject.id,
      teacherId: teacher.id,
      periodsPerWeek: 4
    });
    expect(curriculum.id).toMatch(/^curr_/);

    const schedule = await ScheduleModel.create({
      name: 'Auto ID Schedule'
    });
    expect(schedule.id).toMatch(/^sched_/);
    expect(typeof schedule.createdAt).toBe('string');
  });

  it('queries models by string id and preserves JSON transform', async () => {
    await TeacherModel.create({
      id: 'teach_query_test',
      name: 'Query Test',
      specialization: 'English'
    });

    const found = await TeacherModel.findOne({ id: 'teach_query_test' });
    expect(found).not.toBeNull();
    const json = found!.toJSON();
    expect(json.id).toBe('teach_query_test');
    expect(json.name).toBe('Query Test');
    expect(json._id).toBeUndefined();
    expect(json.__v).toBeUndefined();
  });

  it('verifies SolverProgress interface compiles and types correctly', () => {
    const progress: SolverProgress = {
      step: 10,
      assignedCount: 5,
      totalLectures: 20,
      backtracks: 1,
      elapsedMs: 250
    };
    expect(progress.step).toBe(10);
  });
});
