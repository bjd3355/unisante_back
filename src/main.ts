import { NestFactory } from '@nestjs/core';
import { AppModule } from './database/database.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { join } from 'path';
import * as express from 'express';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active la validation globale des DTO (class-validator)
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors(); // Autoriser les requêtes depuis le frontend

  // Servir les fichiers statiques
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
