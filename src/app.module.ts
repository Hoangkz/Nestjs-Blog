import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Model/user/Entity/user.entity';
import { UserModule } from './Model/user/user.module';
import { ItemsService } from './model/items/items.service';
import { ItemsModule } from './model/items/items.module';
import { AuthController } from './compoments/auth/auth/auth.controller';
import { AuthModule } from './compoments/auth/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'todolist',
      entities: [User],
      synchronize: true,
    }),
    UserModule,
    ItemsModule,
    AuthModule,
  ],
  providers: [ItemsService],
  controllers: [AuthController],
})
export class AppModule { }
