import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Model/user/Entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private authRepository: Repository<User>,
    ) { }

    create(user: User): Promise<User> {
        return this.authRepository.save(user);
    }

    async hashPassword(password: string): Promise<string> {
        const saltRound = process.env.BCRYPT_SALT_ROUNDS;
        const salt = await bcrypt.genSalt(+saltRound);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }
    async countUsersWithEmail(@Query('email') email: string): Promise<number> {
        return this.userService.countUsersWithEmail(email);
    }
}
