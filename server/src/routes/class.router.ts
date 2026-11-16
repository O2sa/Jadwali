import { Router, type Router as ExpressRouter } from 'express';
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} from '../controllers/class.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createClassSchema,
  updateClassSchema,
  deleteClassSchema
} from '../schemas/class.schema.js';

const router: ExpressRouter = Router();

router.get('/', getClasses);
router.get('/:id', validateRequest(deleteClassSchema), getClassById);
router.post('/', validateRequest(createClassSchema), createClass);
router.patch('/:id', validateRequest(updateClassSchema), updateClass);
router.put('/:id', validateRequest(updateClassSchema), updateClass);
router.delete('/:id', validateRequest(deleteClassSchema), deleteClass);

export default router;
