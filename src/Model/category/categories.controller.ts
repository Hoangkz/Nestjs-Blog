import { Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './Entity/Category.entity';

@Controller('category')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll(@Query('page') page: number): Promise<Category[]> {
        return this.categoriesService.findAll(page);
    }
    @Get(":id")
    findCategoryById(@Param("id") id: number): Promise<Category> {
        return this.categoriesService.findCategoryById(id);
    }
    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.categoriesService.deleteCategory(id);
    }
    @Post()
    create(category:Category): Promise<Category> {
        return this.categoriesService.createCategory(category);
    }
    @Put(':id')
    update(@Param('id') id: number, category:Category): Promise<Category> {
        return this.categoriesService.updateCategory(id,category);
    }
}
