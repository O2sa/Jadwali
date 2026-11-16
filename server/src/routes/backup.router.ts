import { Router, type Router as ExpressRouter } from 'express';
import { exportBackup, importBackup } from '../controllers/backup.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { importBackupSchema } from '../schemas/backup.schema.js';

const router: ExpressRouter = Router();

router.get('/export', exportBackup);
router.post('/import', validateRequest(importBackupSchema), importBackup);

export default router;
