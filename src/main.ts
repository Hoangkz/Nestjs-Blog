import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);//thêm này cho phần static file

  const corsOptions: CorsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    optionsSuccessStatus: 200,
  };

  app.enableCors();
  app.useStaticAssets(join(__dirname, '../../uploads'), {
    prefix: '/uploads/',
    index: false,
    fallthrough: true,
  });
  await app.listen(+process.env.PORT_BE);
}

bootstrap();
