import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Curriculum API (/api/v1/curriculum)', () => {
  it('creates, lists, updates, and deletes curriculum assignments', async () => {
    // 1. Create item
    const createRes = await request(app)
      .post('/api/v1/curriculum')
      .send({
        classId: 'cls_1',
        subjectId: 'subj_math',
        teacherId: 'teach_ahmed',
        periodsPerWeek: 5
      });
    expect(createRes.status).toBe(201);
    const item = createRes.body.item;
    expect(item.id).toBeDefined();
    expect(item.classId).toBe('cls_1');
    expect(item.subjectId).toBe('subj_math');
    expect(item.teacherId).toBe('teach_ahmed');
    expect(item.periodsPerWeek).toBe(5);

    // 2. List items
    const listRes = await request(app).get('/api/v1/curriculum');
    expect(listRes.status).toBe(200);
    expect(listRes.body.curriculum.length).toBe(1);
    expect(listRes.body.curriculum[0].id).toBe(item.id);

    // Get item by ID
    const getRes = await request(app).get(`/api/v1/curriculum/${item.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.item.id).toBe(item.id);

    // 3. Patch item
    const patchRes = await request(app)
      .patch(`/api/v1/curriculum/${item.id}`)
      .send({ periodsPerWeek: 6 });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.item.periodsPerWeek).toBe(6);

    // Put item
    const putRes = await request(app)
      .put(`/api/v1/curriculum/${item.id}`)
      .send({ periodsPerWeek: 7 });
    expect(putRes.status).toBe(200);
    expect(putRes.body.item.periodsPerWeek).toBe(7);

    // 4. Delete item
    const delRes = await request(app).delete(`/api/v1/curriculum/${item.id}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    const emptyRes = await request(app).get('/api/v1/curriculum');
    expect(emptyRes.status).toBe(200);
    expect(emptyRes.body.curriculum.length).toBe(0);
  });

  it('returns 404 for nonexistent curriculum item', async () => {
    const getRes = await request(app).get('/api/v1/curriculum/curr_nonexistent');
    expect(getRes.status).toBe(404);

    const patchRes = await request(app)
      .patch('/api/v1/curriculum/curr_nonexistent')
      .send({ periodsPerWeek: 4 });
    expect(patchRes.status).toBe(404);

    const putRes = await request(app)
      .put('/api/v1/curriculum/curr_nonexistent')
      .send({ periodsPerWeek: 4 });
    expect(putRes.status).toBe(404);

    const delRes = await request(app).delete('/api/v1/curriculum/curr_nonexistent');
    expect(delRes.status).toBe(404);
  });

  it('returns 400 when validation fails on create', async () => {
    // Missing required fields
    const missingRes = await request(app)
      .post('/api/v1/curriculum')
      .send({ classId: 'cls_1' });
    expect(missingRes.status).toBe(400);

    // Invalid periodsPerWeek (less than 1)
    const invalidRes = await request(app)
      .post('/api/v1/curriculum')
      .send({
        classId: 'cls_1',
        subjectId: 'subj_1',
        teacherId: 'teach_1',
        periodsPerWeek: 0
      });
    expect(invalidRes.status).toBe(400);
  });

  it('supports explicit id during creation', async () => {
    const res = await request(app)
      .post('/api/v1/curriculum')
      .send({
        id: 'curr_custom_101',
        classId: 'cls_2',
        subjectId: 'subj_science',
        teacherId: 'teach_mariam',
        periodsPerWeek: 4
      });
    expect(res.status).toBe(201);
    expect(res.body.item.id).toBe('curr_custom_101');

    const getRes = await request(app).get('/api/v1/curriculum/curr_custom_101');
    expect(getRes.status).toBe(200);
    expect(getRes.body.item.teacherId).toBe('teach_mariam');
  });
});
