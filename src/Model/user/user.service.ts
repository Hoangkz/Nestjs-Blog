import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './Entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private readonly mailerService: MailerService
    ) { }
    async deletemany(ids: number[]): Promise<any> {
        if (ids.length <= 0) {
            throw new HttpException({ messages: 'Delete items error!' }, HttpStatus.BAD_REQUEST);
        }

        await this.usersRepository.delete(ids);

        return {
            message: "Delete succesfully"
        }
    }
    async findAll(page: number): Promise<User[]> {
        const pageSize = 6; // Define your page size here
        if (page < 1 || !page) {
            page = 1
        }

        const offset = (page - 1) * pageSize;

        return await this.usersRepository.find({
            skip: offset,
            take: pageSize,
        });
    }

    findOne(id: number): Promise<User> {
        return this.usersRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async create(userData: User): Promise<User> {
        const user = this.usersRepository.create(userData);
        return await this.usersRepository.save(user);
    }
    async update(id: number, user: User): Promise<any> {

        await this.usersRepository.update(id, user);
        const { password, refreshtoken, accesstoken, ...rest } = await this.findOne(id);
        return {
            token: await this.generateToken(rest),
            user: rest,
            message: `Update ${rest.email} successfully`
        }
    }
    async search(page: number, search: string): Promise<any> {
        const pageSize = 8;
        if (page < 1 || !page) {
            page = 1
        }
        let total: number
        let listUser: {}
        const offset = (page - 1) * pageSize;

        if (search && search !== undefined) {
            total = await this.usersRepository.createQueryBuilder('user')
                .where('user.email LIKE :search OR user.firstname LIKE :search OR user.lastname LIKE :search', { search: `%${search}%` })
                .getCount();
            listUser = await this.usersRepository.createQueryBuilder('user')
                .where('user.email LIKE :search OR user.firstname LIKE :search OR user.lastname LIKE :search', { search: `%${search}%` })
                .skip(offset)
                .take(pageSize)
                .getMany();
        }
        else {

            total = (await this.usersRepository.find()).length;
            listUser = await this.usersRepository.find();
        }
        const totalPages = Math.ceil(total / pageSize);

        return {
            users: listUser,
            pagination: {
                total: total,
                pageLength: totalPages,
                currentPage: page,
                pageSize: pageSize,
            }
        }
    }
    async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user;
    }

    async generateToken(user: {}) {
        const accesstoken = await this.jwtService.signAsync(user, {
            secret: process.env.SECRET,
            expiresIn: process.env.EXP_IN_ACCESS_TOKEN
        });
        return { accesstoken }
    }
    async ForgotPassword(data: any): Promise<any> {
        const email = data.email
        const user = await this.findByEmail(email)
        if (!user) {
            throw new HttpException({ message: 'Email does not exist!' }, HttpStatus.BAD_REQUEST);
        }
        try {
            await this.sendEmail(email, "password", "test email")
        } catch (error) {
            console.log(error)
            throw new HttpException({ message: "Server error!" }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendEmail(to: string, subject: string, text: string): Promise<void> {
        await this.mailerService.sendMail({
            to,
            subject,
            text,
        });
    }
}
