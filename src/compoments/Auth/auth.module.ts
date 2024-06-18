import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/Model/user/Entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/Model/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: '123456',
      signOptions: { expiresIn: 100 }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService]
})
export class AuthModule { }
