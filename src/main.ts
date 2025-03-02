import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active la validation globale des DTO (class-validator)
  app.useGlobalPipes(new ValidationPipe());

  // Préfixe global optionnel (ex: /api)
  // app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  const host = process.env.PORT || `localhost`;
  await app.listen(port,host);
  console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();
