import { Router, type Router as ExpressRouter } from 'express';
import schoolRouter from './school.router.js';
import teacherRouter from './teacher.router.js';
import classRouter from './class.router.js';
import subjectRouter from './subject.router.js';
import curriculumRouter from './curriculum.router.js';

const apiRouter: ExpressRouter = Router();

apiRouter.use('/school', schoolRouter);
apiRouter.use('/teachers', teacherRouter);
apiRouter.use('/classes', classRouter);
apiRouter.use('/subjects', subjectRouter);
apiRouter.use('/curriculum', curriculumRouter);

export default apiRouter;
