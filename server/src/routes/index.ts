import { Router, type Router as ExpressRouter } from 'express';
import schoolRouter from './school.router.js';
import teacherRouter from './teacher.router.js';
import classRouter from './class.router.js';
import subjectRouter from './subject.router.js';
import curriculumRouter from './curriculum.router.js';
import scheduleRouter from './schedule.router.js';
import backupRouter from './backup.router.js';

const apiRouter: ExpressRouter = Router();

apiRouter.use('/school', schoolRouter);
apiRouter.use('/teachers', teacherRouter);
apiRouter.use('/classes', classRouter);
apiRouter.use('/subjects', subjectRouter);
apiRouter.use('/curriculum', curriculumRouter);
apiRouter.use('/schedules', scheduleRouter);
apiRouter.use('/backup', backupRouter);

export default apiRouter;
