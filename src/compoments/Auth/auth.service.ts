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
        private usersService: UserService,

    ) { }

    async register(user: User): Promise<any> {
        if (user?.password?.length < 6) {
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
            await this.usersService.create(newUser)
            return {
                message: "Register successfully"
            }
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

        const { password, accesstoken, refreshtoken, ...userrest } = user
        // const payload = { id: user.id, email: user.email, lastname: user.lastname, firstname: user.firstname, role: user.role };

        return this.generateToken(userrest)
    }

    private async generateToken(payload: any) {

        //mã hoá
        const accesstoken = await this.jwtService.signAsync(payload, {
            expiresIn: process.env.EXP_IN_ACCESS_TOKEN
        });
        const refreshtoken = await this.jwtService.signAsync(payload, {
            expiresIn: process.env.EXP_IN_REFRESH_TOKEN
        })
        await this.usersRepository.update(
            { email: payload.email },
            { refreshtoken: refreshtoken }
        )

        return { accesstoken };
    }



    async refreshToken(id: number): Promise<any> {
        try {
            console.log(id)
            const user = await this.usersService.findOne(id)
            //giải mã
            const checkExistToken = await this.jwtService.verifyAsync(user.refreshtoken)

            //cách refresh Token
            if (!checkExistToken) {
                throw new HttpException({ message: 'Your session has expired, please log in again' }, HttpStatus.BAD_REQUEST);
            }
            const { password, refreshtoken, accesstoken, ...rest } = user
            const newtoken = await this.jwtService.signAsync(rest, {
                expiresIn: process.env.EXP_IN_ACCESS_TOKEN
            });
            return {
                token: newtoken
            }

        } catch (error) {
            throw new HttpException({ message: 'Your session has expired, please log in again' }, HttpStatus.BAD_REQUEST);
        }
    }
    //token
}
