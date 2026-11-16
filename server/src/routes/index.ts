import { Router, type Router as ExpressRouter } from 'express';
import schoolRouter from './school.router.js';

const apiRouter: ExpressRouter = Router();

apiRouter.use('/school', schoolRouter);

export default apiRouter;
