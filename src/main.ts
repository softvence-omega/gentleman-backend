import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.setup';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import "reflect-metadata";
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/errors/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule,{
     rawBody: true,
    bodyParser: true,
  });

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const app = await NestFactory.create(AppModule, {cors: true});
  
  app.useGlobalFilters(new AllExceptionsFilter());
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('/api/v1/')

  const config = app.get(ConfigService);
  const port = config.get('port') || 3000;
  const node_env = config.get('node_env') || 'development';
  if (node_env !== 'production') {
    setupSwagger(app);
  }

  await app.listen(port);
  console.log(`🚀 Application is running successfully!`);
}

bootstrap().catch((err) => {
  console.error('❌ Error during bootstrap:', err);
  process.exit(1);
});
