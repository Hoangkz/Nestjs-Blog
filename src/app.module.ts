import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './Model/user/user.module';
import { ItemsModule } from './model/items/items.module';
import { AuthModule } from './compoments/Auth/auth.module';
import { dataSourceOptions } from 'db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './Model/category/categories.module';
import { Item } from './model/items/Entity/Items.entity';
import { User } from './Model/user/Entity/user.entity';
import { Category } from './Model/category/Entity/Category.entity';
import { JwtModule } from '@nestjs/jwt';
import { ExtractTokenMiddleware } from './logger/logger.middleware';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    ConfigModule.forRoot(),
    CategoriesModule,
    ItemsModule,
    AuthModule,
    TypeOrmModule.forFeature([Item, User, Category]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractTokenMiddleware)
      .forRoutes(
        { path: '/category', method: RequestMethod.POST },
        { path: '/category', method: RequestMethod.PUT },
        { path: '/category', method: RequestMethod.DELETE },
        { path: '/item', method: RequestMethod.POST },
        { path: '/item', method: RequestMethod.PUT },
        { path: '/item', method: RequestMethod.DELETE },
        { path: '/users', method: RequestMethod.ALL },
        { path: '/auth/refresh-token', method: RequestMethod.POST },
      );
  }
}
