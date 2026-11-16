import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { TeacherModel } from '../src/models/Teacher.model.js';
import { ClassModel } from '../src/models/Class.model.js';
import { SubjectModel } from '../src/models/Subject.model.js';
import { CurriculumModel } from '../src/models/Curriculum.model.js';
import { ScheduleModel } from '../src/models/Schedule.model.js';
import { SchoolConfigModel } from '../src/models/SchoolConfig.model.js';
import { demoBackup } from '../src/scripts/seed.js';

describe('Backup API (/api/v1/backup)', () => {
  it('exports and imports school backups cleanly', async () => {
    // 1. Seed a teacher and config
    await request(app).post('/api/v1/teachers').send({
      id: 'teach_backup_test',
      name: 'Mr. Backup',
      specialization: 'History'
    });

    // 2. Export backup
    const exportRes = await request(app).get('/api/v1/backup/export');
    expect(exportRes.status).toBe(200);
    const backup = exportRes.body;
    expect(backup.version).toBe(1);
    expect(backup.teachers.length).toBe(1);
    expect(backup.teachers[0].name).toBe('Mr. Backup');

    // 3. Clear database & Import modified backup
    await TeacherModel.deleteMany({});
    backup.teachers[0].name = 'Mr. Restored';

    const importRes = await request(app)
      .post('/api/v1/backup/import')
      .send(backup);
    expect(importRes.status).toBe(200);
    expect(importRes.body.success).toBe(true);

    // 4. Verify restored teacher
    const verifyRes = await request(app).get('/api/v1/teachers');
    expect(verifyRes.body.teachers[0].name).toBe('Mr. Restored');
  });

  it('exports and restores complete database across all 6 collections', async () => {
    // Seed records across models
    await SchoolConfigModel.create({
      schoolName: 'Al-Hikma Academy',
      academicYear: '2026/2027',
      term: 'Term 1'
    });
    await TeacherModel.create({
      id: 't_math',
      name: 'Dr. Euler',
      specialization: 'Math',
      maxDailyPeriods: 4,
      maxWeeklyPeriods: 18,
      unavailableSlots: []
    });
    await ClassModel.create({
      id: 'c_10a',
      gradeLevel: 10,
      roomNumber: 'R101',
      sectionName: '10-A',
      periodsPerDay: 7
    });
    await SubjectModel.create({
      id: 's_calc',
      name: 'Calculus',
      code: 'CALC',
      category: 'core'
    });
    await CurriculumModel.create({
      id: 'curr_calc_10a',
      classId: 'c_10a',
      subjectId: 's_calc',
      teacherId: 't_math',
      periodsPerWeek: 4
    });
    await ScheduleModel.create({
      id: 'sched_1',
      name: 'Master Schedule 2026',
      isActive: true,
      status: 'solved',
      solveTimeMs: 120,
      backtrackCount: 0,
      assignments: [
        {
          lectureId: 'l1',
          classId: 'c_10a',
          teacherId: 't_math',
          subjectId: 's_calc',
          dayIndex: 0,
          periodIndex: 0,
          roomNumber: 'R101'
        }
      ]
    });

    // Export backup
    const exportRes = await request(app).get('/api/v1/backup/export');
    expect(exportRes.status).toBe(200);
    const backup = exportRes.body;
    expect(backup.version).toBe(1);
    expect(backup.config.schoolName).toBe('Al-Hikma Academy');
    expect(backup.teachers).toHaveLength(1);
    expect(backup.classes).toHaveLength(1);
    expect(backup.subjects).toHaveLength(1);
    expect(backup.curriculum).toHaveLength(1);
    expect(backup.schedules).toHaveLength(1);

    // Wipe all collections
    await Promise.all([
      SchoolConfigModel.deleteMany({}),
      TeacherModel.deleteMany({}),
      ClassModel.deleteMany({}),
      SubjectModel.deleteMany({}),
      CurriculumModel.deleteMany({}),
      ScheduleModel.deleteMany({})
    ]);

    // Modify exported data
    backup.config.schoolName = 'Al-Hikma Academy (Restored)';
    backup.teachers[0].name = 'Dr. Euler Restored';

    // Import backup
    const importRes = await request(app)
      .post('/api/v1/backup/import')
      .send(backup);
    expect(importRes.status).toBe(200);
    expect(importRes.body.success).toBe(true);

    // Verify all collections restored
    const config = await SchoolConfigModel.findOne();
    expect(config?.schoolName).toBe('Al-Hikma Academy (Restored)');

    const teachers = await TeacherModel.find();
    expect(teachers).toHaveLength(1);
    expect(teachers[0].name).toBe('Dr. Euler Restored');

    const classes = await ClassModel.find();
    expect(classes).toHaveLength(1);
    expect(classes[0].id).toBe('c_10a');

    const subjects = await SubjectModel.find();
    expect(subjects).toHaveLength(1);
    expect(subjects[0].code).toBe('CALC');

    const curriculum = await CurriculumModel.find();
    expect(curriculum).toHaveLength(1);
    expect(curriculum[0].classId).toBe('c_10a');

    const schedules = await ScheduleModel.find();
    expect(schedules).toHaveLength(1);
    expect(schedules[0].name).toBe('Master Schedule 2026');
    expect(schedules[0].assignments).toHaveLength(1);
  });

  it('imports realistic demoBackup successfully via POST /api/v1/backup/import', async () => {
    const res = await request(app)
      .post('/api/v1/backup/import')
      .send(demoBackup);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const configRes = await request(app).get('/api/v1/school/config');
    expect(configRes.body.config.schoolName).toContain('مدرسة جَدْوَلي');

    const teachersRes = await request(app).get('/api/v1/teachers');
    expect(teachersRes.body.teachers.length).toBe(5);

    const classesRes = await request(app).get('/api/v1/classes');
    expect(classesRes.body.classes.length).toBe(3);

    const subjectsRes = await request(app).get('/api/v1/subjects');
    expect(subjectsRes.body.subjects.length).toBe(5);

    const currRes = await request(app).get('/api/v1/curriculum');
    expect(currRes.body.curriculum.length).toBe(6);
  });

  it('rejects invalid backup payloads with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1/backup/import')
      .send({
        teachers: 'not-an-array'
      });
    expect(res.status).toBe(400);
  });
});
