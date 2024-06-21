import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/Model/user/Entity/user.entity';
import { UserService } from 'src/Model/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,

  ],
  controllers: [AuthController],
  providers: [AuthService, UserService]
})
export class AuthModule { }
