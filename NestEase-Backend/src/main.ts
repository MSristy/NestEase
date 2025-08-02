import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS with specific configuration
  app.enableCors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Serve static files from the uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Also serve from the root uploads directory for compatibility
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Static files served from: ${join(process.cwd(), 'uploads')}`);
}
bootstrap();