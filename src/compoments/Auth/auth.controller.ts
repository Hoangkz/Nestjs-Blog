import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/Model/user/Entity/user.entity';
import { UserService } from 'src/Model/user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async register(@Body() user: User): Promise<User> {
        if (user.password.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }
        return this.userService.create(user);
    }

    async login(email: string, password: string): Promise<boolean> {
        // Logic để xác thực người dùng khi đăng nhập
        // Kiểm tra email và password có hợp lệ không
        // Trả về true nếu xác thực thành công, ngược lại false
        return true;
    }
}
