import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CurriculumModel } from '../models/Curriculum.model.js';

export async function getCurriculum(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const curriculum = await CurriculumModel.find();
    res.status(StatusCodes.OK).json({ curriculum: curriculum.map((c) => c.toJSON()) });
  } catch (error) {
    next(error);
  }
}

export async function getCurriculumItemById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await CurriculumModel.findOne({ id: req.params.id });
    if (!item) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Curriculum requirement not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ item: item.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function saveCurriculumItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await CurriculumModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ item: item.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function updateCurriculumItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id: _ignored, ...updates } = req.body;
    const item = await CurriculumModel.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Curriculum requirement not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ item: item.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function deleteCurriculumItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await CurriculumModel.findOneAndDelete({ id: req.params.id });
    if (!item) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Curriculum requirement not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
}
