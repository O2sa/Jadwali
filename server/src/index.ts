import { app } from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { SchoolConfigModel } from './models/SchoolConfig.model.js';
import { TeacherModel } from './models/Teacher.model.js';
import { demoBackup } from './scripts/seed.js';
import { importSchoolBackup } from './services/backup.service.js';

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase(ENV.MONGO_URL);

    if (ENV.AUTO_SEED) {
      const [configCount, teacherCount] = await Promise.all([
        SchoolConfigModel.countDocuments(),
        TeacherModel.countDocuments(),
      ]);
      if (configCount === 0 && teacherCount === 0) {
        console.log('🌱 Database is empty and AUTO_SEED is enabled. Seeding demo school data...');
        await importSchoolBackup(demoBackup);
        console.log('✅ Demo data seeded successfully.');
      }
    }

    app.listen(ENV.PORT, () => {
      console.log(`🚀 Jadwali API server running on http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
