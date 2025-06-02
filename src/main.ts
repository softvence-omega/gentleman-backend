import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { setupSwagger } from './swagger/swagger.setup';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule,{
     rawBody: true,
    bodyParser: true,
  });

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  // Optional: Use configuration if needed
  const config = configuration();
  const port = config.port || 3000;
  const node_env = config.node_env || 'development';

  if (node_env !== 'production') {
    setupSwagger(app);
  }

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Error during bootstrap:', err);
  process.exit(1);
});
