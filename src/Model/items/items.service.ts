import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './Entity/Items.entity';
import { UpdateItem } from './dto/update-item.dto';
@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
    ) { }

    async findAll(page: number): Promise<Item[]> {
        const pageSize = 6; // Define your page size here
        if (page < 1||!page) {
            page = 1
        }
    
        const offset = (page - 1) * pageSize;
    
        return await this.itemsRepository.find({
          skip: offset,
          take: pageSize,
        });
      }

    async search(query: string, page: number): Promise<Item[]> {
        const pageSize = 6;
        if (page < 1||!page) {
            page = 1
        }
        const offset = (page - 1) * pageSize;
        return await this.itemsRepository.createQueryBuilder('item')
          .where('item.name LIKE :query', { query: `%${query}%` })
          .orWhere('item.description LIKE :query', { query: `%${query}%` })
          .skip(offset)
          .take(pageSize)
          .getMany();
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
