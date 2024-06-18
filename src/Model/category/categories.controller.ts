import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './Entity/Category.entity';

@Controller('category')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll(@Query('page') page: number): Promise<Category[]> {
        return this.categoriesService.findAll(page);
    }
}
