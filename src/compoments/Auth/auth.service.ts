import { HttpException, HttpStatus, Injectable, Query, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Model/user/Entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/Model/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private usersService: UserService

    ) { }

    async register(user: User): Promise<User> {
        if (user.password.length < 6) {
            const errorMessage = 'Password must be at least 6 characters long.';
            throw new HttpException({ message: errorMessage }, HttpStatus.BAD_REQUEST);
        }


        const checkUser = await this.usersService.findByEmail(user.email);
        if (checkUser) {
            throw new HttpException({ message: "Email or password already exists!" }, HttpStatus.BAD_REQUEST);
        }
        try {

            const hashedPassword = await this.hashPassword(user.password);
            const newUser = { ...user, password: hashedPassword };
            return await this.usersService.create(newUser)
        } catch (error) {
            throw new HttpException('Failed to register user.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltRound = process.env.BCRYPT_SALT_ROUNDS;
        const salt = await bcrypt.genSalt(+saltRound);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }
    async logout(): Promise<void> {

    }

    async signIn(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.usersRepository.findOne({
            where: { email: loginUserDto.email }
        });

        if (!user) {
            throw new HttpException({ message: "Email or password is incorrect!" }, HttpStatus.BAD_REQUEST);
        }
        const checkPass = await bcrypt.compare(loginUserDto.password, user.password)
        if (!user.password || !checkPass) {
            throw new HttpException({ message: "Email or password is incorrect!" }, HttpStatus.BAD_REQUEST);
        }

        const payload = { id: user.id, email: user.email, lastname: user.lastname, firstname: user.firstname };

        return this.generateToken(payload)
    }

    private async generateToken(payload: { id: number, email: string, lastname: string, firstname: string }) {
        const accesstoken = await this.jwtService.signAsync(payload);
        const refreshtoken = await this.jwtService.signAsync(payload, {
            secret: process.env.SECRET,
            expiresIn: process.env.EXP_IN_REFRESH_TOKEN
        })
        await this.usersRepository.update(
            { email: payload.email },
            { refreshtoken: refreshtoken }
        )

        return { accesstoken, refreshtoken };
    }
    async refreshToken(refreshtoken: string): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refreshtoken, {
                secret: process.env.SECRET
            })
            const checkExistToken = await this.usersRepository.findOneBy({ email: verify.email, refreshtoken: refreshtoken })
            if (!checkExistToken) {
                throw new HttpException({ messages: 'Refresh token is not valid' }, HttpStatus.BAD_REQUEST);
            }
            return this.generateToken({ id: verify.id, email: verify.email, lastname: verify.lastname, firstname: verify.firstname })

        } catch (error) {
            throw new HttpException({ messages: 'Refresh token is not valid' }, HttpStatus.BAD_REQUEST);
        }
        return null
    }
}
