import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common/interceptors/response.interceptors.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  });
  const configService = app.get(ConfigService)
  const port = configService.get<number>('app.port');
  app.useGlobalInterceptors(new ResponseInterceptor())
  await app.listen(port ?? 5050);
}
await bootstrap();
