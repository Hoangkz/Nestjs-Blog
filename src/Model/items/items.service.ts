import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './Entity/Items.entity';
import { UpdateItem } from './dto/update-post.dto';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
    ) { }

    async findAll(): Promise<Item[]> {
        return await this.itemsRepository.find();
    }

    async findById(id: number): Promise<Item> {
        return await this.itemsRepository.findOneBy({ id });
    }

    async create(item: Item): Promise<Item> {
        return await this.itemsRepository.save(item);
    }

    async update(id: number, updateItemDto: UpdateItem): Promise<Item> {
        await this.itemsRepository.update(id, updateItemDto);
        return this.findById(id);
    }

    async remove(id: number): Promise<void> {
        await this.itemsRepository.delete(id);
    }
}
