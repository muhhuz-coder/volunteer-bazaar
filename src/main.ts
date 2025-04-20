import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables early
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ensureDbExists } from './ensure-db';

async function bootstrap() {
  // Ensure database exists before starting the application
  await ensureDbExists();
  
  // Log environment variables for debugging
  console.log('Environment Variables:', {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME ? '[USERNAME SET]' : '[NO USERNAME]',
    DB_PASSWORD: process.env.DB_PASSWORD ? '[PASSWORD SET]' : '[NO PASSWORD]',
    DB_DATABASE: process.env.DB_DATABASE,
    PORT: process.env.PORT,
  });
  
  const app = await NestFactory.create(AppModule);
  
  // Security middlewares
  app.use(helmet());
  app.use(compression());
  
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  
  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enhanced Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Volunteer Bazaar API')
    .setDescription(`
      Welcome to the Volunteer Bazaar API documentation.
      
      This API provides endpoints for managing volunteers, organizations, events, and more.
      
      ## Authentication
      
      Most endpoints require JWT authentication. To use these endpoints:
      1. Sign up or login to get a JWT token
      2. Include the token in the Authorization header as: \`Bearer YOUR_TOKEN\`
      
      ## User Roles
      
      The API supports three user roles:
      - **Volunteer**: Can browse and register for events
      - **Organization**: Can create and manage events
      - **Admin**: Has full access to all endpoints
      
      ## Pagination
      
      List endpoints support pagination using \`page\` and \`limit\` query parameters.
    `)
    .setVersion('1.0')
    .addTag('Authentication', 'Endpoints for user authentication')
    .addTag('Users', 'Endpoints for user management')
    .addTag('Events', 'Endpoints for event management')
    .addTag('Organizations', 'Endpoints for organization management')
    .addTag('Admin', 'Endpoints for administrative tasks')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        in: 'header' 
      },
      'JWT-auth'
    )
    .setContact('Volunteer Bazaar Team', 'https://volunteer-bazaar.example.com', 'support@volunteer-bazaar.example.com')
    .setExternalDoc('Full API Documentation', '/api-documentation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`API Documentation available at: ${await app.getUrl()}/api-docs`);
}
bootstrap().catch(err => {
  console.error('Failed to start application:', err);
});
//test