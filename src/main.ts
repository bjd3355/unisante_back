import { NestFactory } from '@nestjs/core';
import { AppModule } from './database/database.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active la validation globale des DTO (class-validator)
  app.useGlobalPipes(new ValidationPipe());

  // Préfixe global optionnel (ex: /api)
  // app.setGlobalPrefix('api');
  app.enableCors(); // Autoriser les requêtes depuis le frontend

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
