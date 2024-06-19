import { BadRequestException, Body, Controller, Post, Get, Req, UploadedFile, UseInterceptors, Param, Put, Delete, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './Entity/Items.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { UpdateItem } from './dto/update-item.dto';
import { diskStorage } from 'multer';

@Controller('item')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) { }

    @Get('search')
    search(@Query('q') query: string, @Query('page') page: number): Promise<Item[]> {

        return this.itemsService.search(query, page);
    }
    @Get("category")
    GetItemByCategory(@Param('id') id: number, @Query('page') page: number): Promise<Item[]> {
        return this.itemsService.getItemByCategory(id, page);
    }
    @Get()
    findAll(@Query('page') page: number): Promise<any> {
        return this.itemsService.findAll(page);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Item> {
        return this.itemsService.findById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('imageitem', storageConfig("Items")))
    async create(@UploadedFile() file: Express.Multer.File, @Body() item: Item): Promise<any> {
        console.log(file)
        if (file) {
            item = {
                ...item,
                imageitem: file.path
            }
        }
        return this.itemsService.create(item);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.itemsService.remove(+id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('imageitem', storageConfig("Items")))

    async update(@Param('id') id: string, @Req() req: any, @Body() updateItemDto: UpdateItem, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }

        if (file) {
            updateItemDto.image = file.destination + '/' + file.filename;
        }

        return this.itemsService.update(Number(id), updateItemDto)
    }
}
