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
import { Item } from './model/items/Entity/Items.entity';
import { User } from './Model/user/Entity/user.entity';
import { Category } from './Model/category/Entity/Category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    ConfigModule.forRoot(),
    CategoriesModule,
    ItemsModule,
    AuthModule,
    TypeOrmModule.forFeature([Item,User,Category]),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule { }
