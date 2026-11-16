import { Router, type Router as ExpressRouter } from 'express';
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from '../controllers/teacher.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createTeacherSchema,
  updateTeacherSchema,
  deleteTeacherSchema
} from '../schemas/teacher.schema.js';

const router: ExpressRouter = Router();

router.get('/', getTeachers);
router.get('/:id', validateRequest(deleteTeacherSchema), getTeacherById);
router.post('/', validateRequest(createTeacherSchema), createTeacher);
router.patch('/:id', validateRequest(updateTeacherSchema), updateTeacher);
router.put('/:id', validateRequest(updateTeacherSchema), updateTeacher);
router.delete('/:id', validateRequest(deleteTeacherSchema), deleteTeacher);

export default router;
