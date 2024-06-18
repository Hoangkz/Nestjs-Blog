import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './Entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(page:number): Promise<User[]> {
        const pageSize = 6; // Define your page size here
        if (page < 1||!page) {
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
    async update(id: number, user: Partial<User>): Promise<User> {
        await this.usersRepository.update(id, user);
        return this.usersRepository.findOneBy({ id });
    }
    async search(query: string): Promise<User[]> {
        return this.usersRepository.createQueryBuilder('user')
            .where('user.firstname LIKE :query', { query: `%${query}%` })
            .orWhere('user.lastname LIKE :query', { query: `%${query}%` })
            .orWhere('user.email LIKE :query', { query: `%${query}%` })
            .getMany();
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.usersRepository.findOneOrFail({ where: { email } });
        return user;
    }

}
