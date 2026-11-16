import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { exportSchoolBackup, importSchoolBackup } from '../services/backup.service.js';

export async function exportBackup(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const backup = await exportSchoolBackup();
    res.status(StatusCodes.OK).json(backup);
  } catch (error) {
    next(error);
  }
}

export async function importBackup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await importSchoolBackup(req.body);
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
}
