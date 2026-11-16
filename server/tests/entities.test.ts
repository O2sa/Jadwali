import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Teachers, Classes, and Subjects API', () => {
  it('performs full CRUD cycle for Teachers', async () => {
    // 1. Create Teacher
    const createRes = await request(app)
      .post('/api/v1/teachers')
      .send({
        name: 'Fatima Al-Zahra',
        specialization: 'Physics',
        maxDailyPeriods: 4,
        maxWeeklyPeriods: 18,
        unavailableSlots: [{ dayIndex: 1, periodIndex: 0 }]
      });
    expect(createRes.status).toBe(201);
    const teacher = createRes.body.teacher;
    expect(teacher.id).toBeDefined();
    expect(teacher.name).toBe('Fatima Al-Zahra');

    // 2. Get Teachers
    const listRes = await request(app).get('/api/v1/teachers');
    expect(listRes.status).toBe(200);
    expect(listRes.body.teachers.length).toBe(1);

    // Get Teacher by ID
    const singleRes = await request(app).get(`/api/v1/teachers/${teacher.id}`);
    expect(singleRes.status).toBe(200);
    expect(singleRes.body.teacher.name).toBe('Fatima Al-Zahra');

    // 3. Patch Teacher
    const patchRes = await request(app)
      .patch(`/api/v1/teachers/${teacher.id}`)
      .send({ maxDailyPeriods: 5 });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.teacher.maxDailyPeriods).toBe(5);

    // 4. Delete Teacher
    const delRes = await request(app).delete(`/api/v1/teachers/${teacher.id}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    const emptyRes = await request(app).get('/api/v1/teachers');
    expect(emptyRes.body.teachers.length).toBe(0);
  });

  it('performs full CRUD cycle for Classes', async () => {
    const createRes = await request(app)
      .post('/api/v1/classes')
      .send({
        gradeLevel: 10,
        roomNumber: 'Lab 1',
        sectionName: '10/Scientific',
        periodsPerDay: 7
      });
    expect(createRes.status).toBe(201);
    const cls = createRes.body.classRecord;
    expect(cls.id).toBeDefined();
    expect(cls.sectionName).toBe('10/Scientific');

    const listRes = await request(app).get('/api/v1/classes');
    expect(listRes.status).toBe(200);
    expect(listRes.body.classes.length).toBe(1);

    const singleRes = await request(app).get(`/api/v1/classes/${cls.id}`);
    expect(singleRes.status).toBe(200);
    expect(singleRes.body.classRecord.roomNumber).toBe('Lab 1');

    const patchRes = await request(app)
      .patch(`/api/v1/classes/${cls.id}`)
      .send({ roomNumber: 'Lab 2' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.classRecord.roomNumber).toBe('Lab 2');

    const delRes = await request(app).delete(`/api/v1/classes/${cls.id}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);
  });

  it('performs full CRUD cycle for Subjects', async () => {
    const createRes = await request(app)
      .post('/api/v1/subjects')
      .send({
        name: 'Chemistry',
        code: 'CHEM101',
        category: 'science'
      });
    expect(createRes.status).toBe(201);
    const subj = createRes.body.subject;
    expect(subj.id).toBeDefined();
    expect(subj.category).toBe('science');

    const listRes = await request(app).get('/api/v1/subjects');
    expect(listRes.status).toBe(200);
    expect(listRes.body.subjects.length).toBe(1);

    const singleRes = await request(app).get(`/api/v1/subjects/${subj.id}`);
    expect(singleRes.status).toBe(200);
    expect(singleRes.body.subject.code).toBe('CHEM101');

    const patchRes = await request(app)
      .patch(`/api/v1/subjects/${subj.id}`)
      .send({ name: 'Advanced Chemistry' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.subject.name).toBe('Advanced Chemistry');

    const delRes = await request(app).delete(`/api/v1/subjects/${subj.id}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);
  });

  it('returns 404 for nonexistent entities', async () => {
    const tGet = await request(app).get('/api/v1/teachers/nonexistent');
    expect(tGet.status).toBe(404);
    const tPatch = await request(app).patch('/api/v1/teachers/nonexistent').send({ name: 'Nobody' });
    expect(tPatch.status).toBe(404);
    const tDel = await request(app).delete('/api/v1/teachers/nonexistent');
    expect(tDel.status).toBe(404);

    const cGet = await request(app).get('/api/v1/classes/nonexistent');
    expect(cGet.status).toBe(404);
    const cPatch = await request(app).patch('/api/v1/classes/nonexistent').send({ roomNumber: '000' });
    expect(cPatch.status).toBe(404);
    const cDel = await request(app).delete('/api/v1/classes/nonexistent');
    expect(cDel.status).toBe(404);

    const sGet = await request(app).get('/api/v1/subjects/nonexistent');
    expect(sGet.status).toBe(404);
    const sPatch = await request(app).patch('/api/v1/subjects/nonexistent').send({ name: 'Nobody' });
    expect(sPatch.status).toBe(404);
    const sDel = await request(app).delete('/api/v1/subjects/nonexistent');
    expect(sDel.status).toBe(404);
  });

  it('returns 400 when validation fails on create', async () => {
    // Missing required name on teacher
    const tRes = await request(app).post('/api/v1/teachers').send({ specialization: 'Physics' });
    expect(tRes.status).toBe(400);

    // Invalid gradeLevel on class (must be 1-12)
    const cRes = await request(app)
      .post('/api/v1/classes')
      .send({ gradeLevel: 99, roomNumber: '1', sectionName: 'A' });
    expect(cRes.status).toBe(400);

    // Invalid category on subject
    const sRes = await request(app)
      .post('/api/v1/subjects')
      .send({ name: 'Math', code: 'M1', category: 'invalid_category' });
    expect(sRes.status).toBe(400);
  });

  it('supports explicit id during creation', async () => {
    const res = await request(app)
      .post('/api/v1/teachers')
      .send({
        id: 'teach_custom_99',
        name: 'Custom ID Teacher',
        specialization: 'Art'
      });
    expect(res.status).toBe(201);
    expect(res.body.teacher.id).toBe('teach_custom_99');

    const getRes = await request(app).get('/api/v1/teachers/teach_custom_99');
    expect(getRes.status).toBe(200);
    expect(getRes.body.teacher.name).toBe('Custom ID Teacher');
  });
});
