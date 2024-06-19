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

    async findAll(page: number): Promise<any> {
        const pageSize = 10;
        if (page < 1 || !page) {
            page = 1
        }

        const offset = (page - 1) * pageSize;
        const totalItems = await this.itemsRepository.count();
        const totalPages = Math.ceil(totalItems / pageSize);
        const listItems = await this.itemsRepository.find({
            skip: offset,
            take: pageSize,
            relations: ['category']
        });
        return {
            items: listItems,
            pagination: {
                totalItems: totalItems,
                pageLength: totalPages,
                currentPage: page,
                pageSize: pageSize,
            }
        };
    }
    async getItemByCategory(idcategory: number, page: number): Promise<Item[]> {
        const pageSize = 6;
        if (page < 1 || !page) {
            page = 1
        }

        const offset = (page - 1) * pageSize;

        return await this.itemsRepository.find({
            where: { category: { id: idcategory } },
            relations: ['category'],
            skip: offset,
            take: pageSize,
        });
    }

    async search(query: string, page: number): Promise<Item[]> {
        const pageSize = 8;
        if (page < 1 || !page) {
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

    async create(item: Item): Promise<any> {
        await this.itemsRepository.save(item);
        return {
            message: `Created ${item.name} item success!`
        }
    }

    async update(id: number, updateItemDto: UpdateItem): Promise<Item> {
        await this.itemsRepository.update(id, updateItemDto);
        return this.findById(id);
    }

    async remove(id: number): Promise<void> {
        await this.itemsRepository.delete(id);
    }
}
