import { Router, type Router as ExpressRouter } from 'express';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subject.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createSubjectSchema,
  updateSubjectSchema,
  deleteSubjectSchema
} from '../schemas/subject.schema.js';

const router: ExpressRouter = Router();

router.get('/', getSubjects);
router.get('/:id', validateRequest(deleteSubjectSchema), getSubjectById);
router.post('/', validateRequest(createSubjectSchema), createSubject);
router.patch('/:id', validateRequest(updateSubjectSchema), updateSubject);
router.put('/:id', validateRequest(updateSubjectSchema), updateSubject);
router.delete('/:id', validateRequest(deleteSubjectSchema), deleteSubject);

export default router;
