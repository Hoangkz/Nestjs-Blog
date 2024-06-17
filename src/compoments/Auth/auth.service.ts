import { Injectable } from '@nestjs/common';
import { User } from 'src/Model/user/Entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/Model/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    async register(user: User): Promise<User> {
        if (user.password.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = { ...user, password: hashedPassword };

        return this.userService.create(newUser);
    }

}
