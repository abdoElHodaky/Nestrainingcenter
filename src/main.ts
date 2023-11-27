import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors'; // Import the cors module

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.use(
    cors({
      origin: 'http://localhost:4200', // Update with your Angular frontend URL
      credentials: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
