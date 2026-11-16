import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ClassModel } from '../models/Class.model.js';

export async function getClasses(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const classes = await ClassModel.find();
    res.status(StatusCodes.OK).json({ classes: classes.map((c) => c.toJSON()) });
  } catch (error) {
    next(error);
  }
}

export async function getClassById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cls = await ClassModel.findOne({ id: req.params.id });
    if (!cls) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Class not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ classRecord: cls.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function createClass(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cls = await ClassModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ classRecord: cls.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function updateClass(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cls = await ClassModel.findOne({ id: req.params.id });
    if (!cls) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Class not found' });
      return;
    }
    const { id: _ignored, ...updates } = req.body;
    Object.assign(cls, updates);
    await cls.save();
    res.status(StatusCodes.OK).json({ classRecord: cls.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function deleteClass(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cls = await ClassModel.findOneAndDelete({ id: req.params.id });
    if (!cls) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Class not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
}
