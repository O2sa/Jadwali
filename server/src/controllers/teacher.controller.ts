import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TeacherModel } from '../models/Teacher.model.js';

export async function getTeachers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const teachers = await TeacherModel.find();
    res.status(StatusCodes.OK).json({ teachers: teachers.map((t) => t.toJSON()) });
  } catch (error) {
    next(error);
  }
}

export async function getTeacherById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const teacher = await TeacherModel.findOne({ id: req.params.id });
    if (!teacher) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Teacher not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ teacher: teacher.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function createTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const teacher = await TeacherModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ teacher: teacher.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function updateTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const teacher = await TeacherModel.findOne({ id: req.params.id });
    if (!teacher) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Teacher not found' });
      return;
    }
    const { id: _ignored, ...updates } = req.body;
    Object.assign(teacher, updates);
    await teacher.save();
    res.status(StatusCodes.OK).json({ teacher: teacher.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function deleteTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const teacher = await TeacherModel.findOneAndDelete({ id: req.params.id });
    if (!teacher) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Teacher not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
}
