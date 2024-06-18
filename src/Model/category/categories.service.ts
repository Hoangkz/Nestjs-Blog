
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

    findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }
    async createCategory(@Body() category: Category): Promise<Category> {
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
}
