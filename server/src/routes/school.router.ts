import { Router, type Router as ExpressRouter } from 'express';
import { getConfig, saveConfig } from '../controllers/school.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { saveSchoolConfigSchema } from '../schemas/school.schema.js';

const router: ExpressRouter = Router();

router.get('/config', getConfig);
router.post('/config', validateRequest(saveSchoolConfigSchema), saveConfig);

export default router;
