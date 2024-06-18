import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/Model/user/Entity/user.entity';
import { AuthService } from './auth.service';

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("register")
    async register(@Body() user: User): Promise<any> {
        return this.authService.register(user);
    }

    @Post('login')
    async login(email: string, password: string): Promise<any> {
        return this.authService.signIn(email, password);
    }
    @Post('refresh-token')
    refreshToken(@Body() { refreshtoken }): Promise<any> {
        console.log('refresh token api')
        return this.authService.refreshToken(refreshtoken);
    }
}
