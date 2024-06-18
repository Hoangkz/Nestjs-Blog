import { BadRequestException, Body, Controller, Post, Get, Req, UploadedFile, UseInterceptors, Param, Put, Delete, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './Entity/Items.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { UpdateItem } from './dto/update-item.dto';
import { get } from 'http';

@Controller('item')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) { }

    @Get('search')
    search(@Query('q') query: string,@Query('page') page: number): Promise<Item[]> {
        return this.itemsService.search(query,page);
    }
    @Get("category")
    GetItemByCategory(@Param('id') id: number,@Query('page') page: number): Promise<Item[]>{
        return this.itemsService.getItemByCategory(id,page);
    }
    @Get()
    findAll(@Query('page') page: number): Promise<Item[]> {
        return this.itemsService.findAll(page);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Item> {
        return this.itemsService.findById(id);
    }

    @Post()
    create(@Body() item: Item): Promise<Item> {
        return this.itemsService.create(item);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.itemsService.remove(+id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image', {
        storage: storageConfig('Item'),
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
    update(@Param('id') id: string, @Req() req: any, @Body() updateItemDto: UpdateItem, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }

        if (file) {
            updateItemDto.image = file.destination + '/' + file.filename;
        }

        return this.itemsService.update(Number(id), updateItemDto)
    }
}
