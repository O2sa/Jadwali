import { Router, type Router as ExpressRouter } from 'express';
import {
  getCurriculum,
  getCurriculumItemById,
  saveCurriculumItem,
  updateCurriculumItem,
  deleteCurriculumItem
} from '../controllers/curriculum.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createCurriculumSchema,
  updateCurriculumSchema,
  deleteCurriculumSchema
} from '../schemas/curriculum.schema.js';

const router: ExpressRouter = Router();

router.get('/', getCurriculum);
router.get('/:id', validateRequest(deleteCurriculumSchema), getCurriculumItemById);
router.post('/', validateRequest(createCurriculumSchema), saveCurriculumItem);
router.patch('/:id', validateRequest(updateCurriculumSchema), updateCurriculumItem);
router.put('/:id', validateRequest(updateCurriculumSchema), updateCurriculumItem);
router.delete('/:id', validateRequest(deleteCurriculumSchema), deleteCurriculumItem);

export default router;
