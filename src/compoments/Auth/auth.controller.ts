import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { User } from 'src/Model/user/Entity/user.entity';
import { AuthService } from './auth.service';
import { log } from 'console';
import { UserService } from 'src/Model/user/user.service';

@Controller()
export class AuthController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

    @Post("register")
    async register(@Body() user: User): Promise<User> {
        if (user.password.length < 6) {
            const errorMessage = 'Password must be at least 6 characters long.';
            throw new HttpException({ message: errorMessage }, HttpStatus.BAD_REQUEST);
        }

        try {
        
            const ListUser = await this.authService.findByEmail(user.email);
            if(ListUser.length >0){
                throw new HttpException({ message: "Email already exists!" }, HttpStatus.BAD_REQUEST);
            }

            const hashedPassword = await this.authService.hashPassword(user.password);
            const newUser = { ...user, password: hashedPassword };
            return await this.userService.create(newUser)
        } catch (error) {
            throw new HttpException('Failed to register user.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async login(email: string, password: string): Promise<boolean> {
        // Logic để xác thực người dùng khi đăng nhập
        // Kiểm tra email và password có hợp lệ không
        // Trả về true nếu xác thực thành công, ngược lại false
        return true;
    }
}
