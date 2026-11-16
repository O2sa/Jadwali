import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('School Config API (/api/v1/school/config)', () => {
  it('GET /api/v1/school/config returns default school configuration when empty', async () => {
    const res = await request(app).get('/api/v1/school/config');
    expect(res.status).toBe(200);
    expect(res.body.config).toBeDefined();
    expect(res.body.config.schoolName).toBe('Jadwali School');
    expect(res.body.config.workingDays).toEqual([0, 1, 2, 3, 4]);
  });

  it('POST /api/v1/school/config updates the configuration singleton', async () => {
    const res = await request(app)
      .post('/api/v1/school/config')
      .send({
        config: {
          schoolName: 'Al-Amal Secondary School',
          academicYear: '2027/2028'
        }
      });
    expect(res.status).toBe(200);
    expect(res.body.config.schoolName).toBe('Al-Amal Secondary School');
    expect(res.body.config.academicYear).toBe('2027/2028');

    const getRes = await request(app).get('/api/v1/school/config');
    expect(getRes.body.config.schoolName).toBe('Al-Amal Secondary School');
  });

  it('POST /api/v1/school/config supports updating gradePeriodsConfig and periodsPerDayDefault', async () => {
    const res = await request(app)
      .post('/api/v1/school/config')
      .send({
        config: {
          periodsPerDayDefault: 8,
          gradePeriodsConfig: { '1': 5, '2': 6 }
        }
      });
    expect(res.status).toBe(200);
    expect(res.body.config.periodsPerDayDefault).toBe(8);
    expect(res.body.config.gradePeriodsConfig).toMatchObject({ '1': 5, '2': 6 });
  });

  it('POST /api/v1/school/config returns 400 when validation fails', async () => {
    const res = await request(app)
      .post('/api/v1/school/config')
      .send({
        config: {
          workingDays: 'not-an-array'
        }
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('returns 404 for unknown route', async () => {
    const res = await request(app).get('/api/v1/unknown');
    expect(res.status).toBe(404);
    expect(res.body.message).toContain('Route not found');
  });
});
