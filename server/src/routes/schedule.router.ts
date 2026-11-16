import { Router, type Router as ExpressRouter } from 'express';
import {
  getSchedules,
  getActiveSchedule,
  getScheduleById,
  saveSchedule,
  setActiveSchedule,
  deleteSchedule,
  generateSchedule
} from '../controllers/schedule.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createScheduleSchema,
  scheduleIdParamSchema,
  generateScheduleSchema
} from '../schemas/schedule.schema.js';

const router: ExpressRouter = Router();

router.get('/', getSchedules);
router.get('/active', getActiveSchedule);
router.post('/generate', validateRequest(generateScheduleSchema), generateSchedule);
router.post('/', validateRequest(createScheduleSchema), saveSchedule);
router.get('/:id', validateRequest(scheduleIdParamSchema), getScheduleById);
router.post('/:id/active', validateRequest(scheduleIdParamSchema), setActiveSchedule);
router.delete('/:id', validateRequest(scheduleIdParamSchema), deleteSchedule);

export default router;
