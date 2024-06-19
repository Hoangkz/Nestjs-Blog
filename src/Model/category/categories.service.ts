
import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './Entity/Category.entity';
import { UpdateCategory } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    findAll(page: number): Promise<Category[]> {
        const pageSize = 6;
        if (page < 1) {
            page = 1
        }
        else if (!page) {
            return this.categoryRepository.find();
        }
        const offset = (page - 1) * pageSize;

        return this.categoryRepository.find({
            skip: offset,
            take: pageSize
        });
    }

    async findCategoryById(id: number): Promise<Category> {
        return this.categoryRepository.findOneBy({ id });

    }

    async createCategory(category: Category): Promise<Category> {
        try {
            return await this.categoryRepository.save(category);

        } catch (error) {
            throw new HttpException({ messages: 'Create category error!' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCategory(id: number, updateCategory: UpdateCategory): Promise<Category> {
        await this.categoryRepository.update(id, updateCategory);
        return this.categoryRepository.findOneBy({ id });
    }
    async deleteCategory(id: number): Promise<void> {
        await this.categoryRepository.delete(id);
    }

}
