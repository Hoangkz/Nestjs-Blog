import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './Entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
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
        
        return {
            message:`Update ${user.email} successfully`
        }
    }
    async search(page: number, search: string): Promise<any> {
        const pageSize = 10;
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

}
