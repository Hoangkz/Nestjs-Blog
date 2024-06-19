import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/Model/user/Entity/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("register")
    async register(@Body() user: User): Promise<any> {
        return this.authService.register(user);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
        return this.authService.signIn(loginUserDto);
    }
    @Post('logout')
    async logout(): Promise<any> {
        return this.authService.logout();
    }
    @Post('refresh-token')
    refreshToken(@Body() { refreshtoken }): Promise<any> {
        console.log('refresh token api')
        return this.authService.refreshToken(refreshtoken);
    }
}
