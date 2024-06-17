import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Model/user/Entity/user.entity';
import { UserModule } from './Model/user/user.module';
import { ItemsService } from './model/items/items.service';
import { ItemsModule } from './model/items/items.module';
import { AuthController } from './compoments/auth/auth.controller';
import { AuthModule } from './compoments/auth/auth.module';
import * as dotenv from 'dotenv';
import { Item } from './model/items/Entity/Items.entity';
import { ItemsController } from './model/items/items.controller';
import { UserController } from './Model/user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'todolist',
      entities: [User, Item],
      synchronize: true,
    }),
    UserModule,
    ItemsModule,
    AuthModule,
  ],
  providers: [ItemsService],
  controllers: [AuthController, ItemsController, UserController],
})
export class AppModule { }
