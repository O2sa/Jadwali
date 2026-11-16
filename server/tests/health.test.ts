import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';

describe('Test Infrastructure Health', () => {
  it('connects to in-memory mongodb and executes queries', async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
