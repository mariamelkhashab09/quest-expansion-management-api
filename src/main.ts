import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Quest Expansion Management API')
    .setDescription('API for managing quest expansion projects')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('projects', 'Project management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        name: 'Authorization',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger documentation
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger UI is available at: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
