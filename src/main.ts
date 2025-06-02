import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.setup';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import "reflect-metadata";
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const app = await NestFactory.create(AppModule, {cors: true});

  // Optional: Use configuration if needed
  const config = app.get(ConfigService);
  const port = config.get('port') || 3000;
  const node_env = config.get('node_env') || 'development';

  if (node_env !== 'production') {
    setupSwagger(app);
  }

  app.setGlobalPrefix('/api/v1/')

  await app.listen(port);
  console.log(`🚀 Application is running successfully!`);
}

bootstrap().catch((err) => {
  console.error('❌ Error during bootstrap:', err);
  process.exit(1);
});
