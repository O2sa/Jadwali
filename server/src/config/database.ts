import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDatabase(uri = ENV.MONGO_URL): Promise<void> {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('MongoDB connected successfully');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
