import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './Entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_SV,
          pass: process.env.PASSWORD_SV,
        },
      },
      defaults: {
        from: '"Your Application" <noreply@example.com>',
      },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule { }
