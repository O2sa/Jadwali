import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SubjectModel } from '../models/Subject.model.js';

export async function getSubjects(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subjects = await SubjectModel.find();
    res.status(StatusCodes.OK).json({ subjects: subjects.map((s) => s.toJSON()) });
  } catch (error) {
    next(error);
  }
}

export async function getSubjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subj = await SubjectModel.findOne({ id: req.params.id });
    if (!subj) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Subject not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ subject: subj.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function createSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subj = await SubjectModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ subject: subj.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function updateSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subj = await SubjectModel.findOne({ id: req.params.id });
    if (!subj) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Subject not found' });
      return;
    }
    const { id: _ignored, ...updates } = req.body;
    Object.assign(subj, updates);
    await subj.save();
    res.status(StatusCodes.OK).json({ subject: subj.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function deleteSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subj = await SubjectModel.findOneAndDelete({ id: req.params.id });
    if (!subj) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Subject not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
}
