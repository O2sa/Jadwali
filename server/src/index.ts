import { app } from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase(ENV.MONGO_URL);
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Jadwali API server running on http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
