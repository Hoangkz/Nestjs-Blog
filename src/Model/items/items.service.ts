import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './Entity/Items.entity';
import { deleteFile } from 'helpers/config';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
    ) { }

    async findAll(page: number, search: string): Promise<any> {
        const pageSize = 10;
        if (page < 1 || !page) {
            page = 1
        }
        let totalItems: number
        let listItems: {}
        const offset = (page - 1) * pageSize;
        if (search) {

            totalItems = await this.itemsRepository.createQueryBuilder('item')
                .leftJoinAndSelect('item.category', 'category')
                .where('item.name LIKE :query OR item.description LIKE :query OR category.name LIKE :query', { query: `%${search}%` })
                .getCount();
            listItems = await this.itemsRepository.createQueryBuilder('item')
                .leftJoinAndSelect('item.category', 'category')
                .where('item.name LIKE :query OR item.description LIKE :query OR category.name LIKE :query', { query: `%${search}%` })
                .skip(offset)
                .take(pageSize)
                .getMany();
        }
        else {

            totalItems = await this.itemsRepository.count();
            listItems = await this.itemsRepository.find({
                skip: offset,
                take: pageSize,
                relations: ['category']
            });
        }
        const totalPages = Math.ceil(totalItems / pageSize);


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

    async update(id: number, item: Item): Promise<any> {

        if (item.imageitem) {
            const itemOld = await this.findById(id)
            deleteFile(itemOld.imageitem)
        }
        await this.itemsRepository.update(id, item);
    }

    async remove(id: number): Promise<void> {
        await this.itemsRepository.delete(id);
    }
    async deletemany(ids: number[]): Promise<any> {
        if (ids.length <= 0) {
            throw new HttpException({ messages: 'Delete items error!' }, HttpStatus.BAD_REQUEST);
        }
        const itemsToDelete = await this.itemsRepository.findByIds(ids);
        console.log(itemsToDelete.length)
        itemsToDelete.forEach(item => {
            deleteFile(item.imageitem);
        });
        await this.itemsRepository.delete(ids);

        return {
            message: "Delete succesfully"
        }
    }


}
