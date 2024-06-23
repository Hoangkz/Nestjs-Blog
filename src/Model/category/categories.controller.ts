import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './Entity/Category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';

@Controller('category')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }
    @Get("admin")
    adminFindAll(@Query('page') page: number, @Query('search') search: string): Promise<any> {
        return this.categoriesService.AdminFindAll(page, search);
    }
    @Delete("many")
    @UsePipes(new ValidationPipe({ transform: true }))
    DeleteMany(@Body() deleteManyDto: any): Promise<void> {
        return this.categoriesService.deletemany(deleteManyDto.data.listid);
    }
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
    @UseInterceptors(FileInterceptor('thumbnail', storageConfig("Category")))
    create(@UploadedFile() file: Express.Multer.File, @Body() category: Category): Promise<Category> {
        if (file) {
            category = {
                ...category,
                thumbnail: file.path
            }
        }
        else if (file === undefined) {
            category = {
                ...category,
            }
            delete category.thumbnail;
        }
        category = {
            ...category
        }
        return this.categoriesService.createCategory(category);
    }


    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail', storageConfig("Category")))
    update(@Param('id') id: number, @Body() category: Category, @UploadedFile() file: Express.Multer.File): Promise<any> {
        if (file) {
            category = {
                ...category,
                thumbnail: file.path
            }
        }
        else if (file === undefined) {
            category = {
                ...category,
            }
            delete category.thumbnail;
        }
        category = {
            ...category
        }
        return this.categoriesService.updateCategory(id, category);
    }

    
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Category> {
        return this.categoriesService.findCategoryById(id);
    }
}
