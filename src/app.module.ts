import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './Model/user/user.module';
import { ItemsModule } from './model/items/items.module';
import { AuthModule } from './compoments/auth/auth.module';
import { dataSourceOptions } from 'db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './Model/category/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    ConfigModule.forRoot(),
    CategoriesModule,
    ItemsModule,
    AuthModule
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule { }
