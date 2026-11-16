import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ScheduleModel } from '../models/Schedule.model.js';
import { generateScheduleServer } from '../services/solver.service.js';

export async function getSchedules(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schedules = await ScheduleModel.find().sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ schedules: schedules.map((s) => s.toJSON()) });
  } catch (error) {
    next(error);
  }
}

export async function getActiveSchedule(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const active = await ScheduleModel.findOne({ isActive: true });
    res.status(StatusCodes.OK).json({ schedule: active ? active.toJSON() : null });
  } catch (error) {
    next(error);
  }
}

export async function getScheduleById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schedule = await ScheduleModel.findOne({ id: req.params.id });
    if (!schedule) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Schedule not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ schedule: schedule.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function saveSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.body.isActive) {
      await ScheduleModel.updateMany({ isActive: true }, { $set: { isActive: false } });
    }
    const schedule = await ScheduleModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ schedule: schedule.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function setActiveSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schedule = await ScheduleModel.findOne({ id: req.params.id });
    if (!schedule) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Schedule not found' });
      return;
    }
    await ScheduleModel.updateMany({ isActive: true }, { $set: { isActive: false } });
    schedule.isActive = true;
    await schedule.save();
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function deleteSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schedule = await ScheduleModel.findOneAndDelete({ id: req.params.id });
    if (!schedule) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Schedule not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function generateSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const schedule = await generateScheduleServer(req.body?.options);
    res.status(StatusCodes.OK).json({ schedule });
  } catch (error) {
    next(error);
  }
}
