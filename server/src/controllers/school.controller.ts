import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SchoolConfigModel } from '../models/SchoolConfig.model.js';

export async function getConfig(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let config = await SchoolConfigModel.findOne();
    if (!config) {
      config = await SchoolConfigModel.create({});
    }
    res.status(StatusCodes.OK).json({ config: config.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function saveConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const payload = req.body.config || {};
    let config = await SchoolConfigModel.findOne();
    if (!config) {
      config = await SchoolConfigModel.create(payload);
    } else {
      Object.assign(config, payload);
      await config.save();
    }
    res.status(StatusCodes.OK).json({ config: config.toJSON() });
  } catch (error) {
    next(error);
  }
}
