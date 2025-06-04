import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('gentleman backend')
  .setDescription('API documentation for the vehicles service')
  .setVersion('1.0')
  .addTag('Gentleman')
  .addBearerAuth(
    {
      type: 'http',
      name: 'Authorization', 
      in: 'header',
      description: 'Enter JWT token like: Bearer <token>',
    },
    'access-token'
  )
  .build();
