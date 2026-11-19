import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 6666,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/school-scheduler',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  AUTO_SEED: process.env.AUTO_SEED === 'true'
};
