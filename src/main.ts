import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);//thêm này cho phần static file

  const corsOptions: CorsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    optionsSuccessStatus: 200,
  };
  app.use(bodyParser.json());

  app.enableCors();
  app.useStaticAssets(join(__dirname, '../../uploads'), {
    prefix: '/uploads/',
    index: false,
    fallthrough: true,
  });


  const config = new DocumentBuilder()
    .setTitle('Phần mềm quản lý')
    .setDescription('Phần mềm quản lý ')
    .setVersion('1.1')
    .addTag('shop')
    .addBearerAuth(
      {
        name: 'Authentication',
        bearerFormat: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(+process.env.PORT_BE);
}

bootstrap();
