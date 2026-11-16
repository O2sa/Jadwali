import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { ScheduleModel } from '../src/models/Schedule.model.js';
import { SchoolConfigModel } from '../src/models/SchoolConfig.model.js';
import { TeacherModel } from '../src/models/Teacher.model.js';
import { ClassModel } from '../src/models/Class.model.js';
import { SubjectModel } from '../src/models/Subject.model.js';
import { CurriculumModel } from '../src/models/Curriculum.model.js';

describe('Schedules API (/api/v1/schedules)', () => {
  it('saves, retrieves, sets active, and deletes a schedule', async () => {
    // Check initial active schedule is null
    const initialActive = await request(app).get('/api/v1/schedules/active');
    expect(initialActive.status).toBe(200);
    expect(initialActive.body.schedule).toBeNull();

    // 1. Save schedule
    const createRes = await request(app)
      .post('/api/v1/schedules')
      .send({
        name: 'Fall 2026 Master',
        status: 'solved',
        solveTimeMs: 120,
        backtrackCount: 3,
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
    expect(createRes.status).toBe(201);
    const schedule = createRes.body.schedule;
    expect(schedule.id).toBeDefined();
    expect(schedule.name).toBe('Fall 2026 Master');

    // Retrieve schedule by ID
    const getByIdRes = await request(app).get(`/api/v1/schedules/${schedule.id}`);
    expect(getByIdRes.status).toBe(200);
    expect(getByIdRes.body.schedule.id).toBe(schedule.id);

    // 2. Set active
    const activeRes = await request(app).post(`/api/v1/schedules/${schedule.id}/active`);
    expect(activeRes.status).toBe(200);
    expect(activeRes.body.success).toBe(true);

    // 3. Get active
    const getActiveRes = await request(app).get('/api/v1/schedules/active');
    expect(getActiveRes.status).toBe(200);
    expect(getActiveRes.body.schedule.id).toBe(schedule.id);
    expect(getActiveRes.body.schedule.isActive).toBe(true);

    // 4. List schedules
    const listRes = await request(app).get('/api/v1/schedules');
    expect(listRes.status).toBe(200);
    expect(listRes.body.schedules.length).toBe(1);

    // 5. Delete schedule
    const delRes = await request(app).delete(`/api/v1/schedules/${schedule.id}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    const afterDel = await request(app).get('/api/v1/schedules/active');
    expect(afterDel.body.schedule).toBeNull();
  });

  it('handles 404 for non-existent schedules', async () => {
    const getRes = await request(app).get('/api/v1/schedules/nonexistent');
    expect(getRes.status).toBe(404);

    const activeRes = await request(app).post('/api/v1/schedules/nonexistent/active');
    expect(activeRes.status).toBe(404);

    const delRes = await request(app).delete('/api/v1/schedules/nonexistent');
    expect(delRes.status).toBe(404);
  });

  it('deactivates previous schedule when setting another schedule as active or saving active', async () => {
    const s1 = await ScheduleModel.create({
      name: 'Schedule 1',
      isActive: true,
      status: 'solved',
      solveTimeMs: 10,
      backtrackCount: 0,
      assignments: []
    });

    const s2 = await ScheduleModel.create({
      name: 'Schedule 2',
      isActive: false,
      status: 'solved',
      solveTimeMs: 20,
      backtrackCount: 0,
      assignments: []
    });

    // Make s2 active
    const activeRes = await request(app).post(`/api/v1/schedules/${s2.id}/active`);
    expect(activeRes.status).toBe(200);

    const checkS1 = await ScheduleModel.findOne({ id: s1.id });
    const checkS2 = await ScheduleModel.findOne({ id: s2.id });
    expect(checkS1?.isActive).toBe(false);
    expect(checkS2?.isActive).toBe(true);

    // Save s3 with isActive: true
    const createRes = await request(app)
      .post('/api/v1/schedules')
      .send({
        name: 'Schedule 3',
        isActive: true,
        status: 'solved',
        solveTimeMs: 15,
        backtrackCount: 1,
        assignments: []
      });
    expect(createRes.status).toBe(201);

    const checkS2Again = await ScheduleModel.findOne({ id: s2.id });
    const checkS3 = await ScheduleModel.findOne({ id: createRes.body.schedule.id });
    expect(checkS2Again?.isActive).toBe(false);
    expect(checkS3?.isActive).toBe(true);
  });

  it('generates a schedule on the server using school-timetabling-engine', async () => {
    // Populate minimal valid timetable problem
    await SchoolConfigModel.create({
      schoolName: 'Test School',
      workingDays: [0, 1, 2],
      periodsPerDayDefault: 4
    });
    await TeacherModel.create({
      id: 't_math',
      name: 'Teacher Math',
      specialization: 'Math',
      maxDailyPeriods: 4,
      maxWeeklyPeriods: 10,
      unavailableSlots: []
    });
    await ClassModel.create({
      id: 'c_1',
      gradeLevel: 1,
      roomNumber: 'Room 1',
      sectionName: 'Grade 1A',
      periodsPerDay: 4
    });
    await SubjectModel.create({
      id: 's_math',
      name: 'Mathematics',
      code: 'MATH',
      category: 'core'
    });
    await CurriculumModel.create({
      id: 'cur_1',
      classId: 'c_1',
      subjectId: 's_math',
      teacherId: 't_math',
      periodsPerWeek: 3
    });

    const genRes = await request(app)
      .post('/api/v1/schedules/generate')
      .send({ options: { timeoutMs: 5000 } });

    expect(genRes.status).toBe(200);
    expect(genRes.body.schedule).toBeDefined();
    expect(genRes.body.schedule.status).toBe('solved');
    expect(genRes.body.schedule.isActive).toBe(true);
    expect(genRes.body.schedule.assignments.length).toBe(3);

    // Verify it is now the active schedule
    const activeRes = await request(app).get('/api/v1/schedules/active');
    expect(activeRes.body.schedule.id).toBe(genRes.body.schedule.id);
  });
});
