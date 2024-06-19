import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './Entity/Category.entity';
import { UpdateCategory } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }
    @Post()
    CreateCategory(@Body() categories: Category): Promise<Category> {
        return this.categoriesService.createCategory(categories);
    }
    @Put(':id')
    @UseInterceptors(FileInterceptor('imageCategory', {
        storage: storageConfig('Category'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
            } else {
                const fileSize = parseInt(req.headers['content-length']);
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError = 'File size is too large. Accepted file size is less than 5 MB';
                    cb(null, false);
                } else {
                    cb(null, true);
                }
            }
        }
    }))
    async updateCategory(@Param('id') id: string, @Req() req: any, @Body() updateItemDto: UpdateCategory, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }

        if (file) {
            updateItemDto.imageCategory = file.destination + '/' + file.filename;
        }

        return this.categoriesService.updateCategory(Number(id), updateItemDto)
    }

    @Delete(':id')
    Delete(@Param('id') id: number): Promise<void> {
        return this.categoriesService.deleteCategory(id);
    }
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Category> {
        return this.categoriesService.findCategoryById(id);
    }
}
