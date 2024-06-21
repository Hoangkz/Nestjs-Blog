import { MiddlewareConsumer, BadRequestException, Body, Controller, Post, Get, Req, UploadedFile, UseInterceptors, Param, Put, Delete, Query, UsePipes, ValidationPipe, } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './Entity/Items.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { ExtractTokenMiddleware } from 'src/logger/logger.middleware';

@Controller('item')
export class ItemsController {
    constructor(
        private readonly itemsService: ItemsService,
    ) { }

    @Delete('many')
    @UsePipes(new ValidationPipe({ transform: true }))
    async deleteMany(@Body() deleteManyDto: any): Promise<any> {
        const listId = deleteManyDto?.data?.listid

        return this.itemsService.deletemany(listId);

    }
    @Get('search')
    search(@Query('q') query: string, @Query('page') page: number): Promise<any> {
        return this.itemsService.search(query, page);
    }
    @Get("category")
    async GetItemByCategory(@Query('id') id: number, @Query('page') page: number): Promise<any> {
        return this.itemsService.getItemByCategory(id, page);
    }
    @Get()
    findAll(@Query('page') page: number, @Query('search') search: string, @Query('count') count: number): Promise<any> {
        return this.itemsService.findAll(page, search, count);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Item> {
        return this.itemsService.findById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('imageitem', storageConfig("Items")))
    async create(@UploadedFile() file: Express.Multer.File, @Body() item: Item): Promise<any> {
        if (file) {
            item = {
                ...item,
                imageitem: file.path
            }
        }
        else if (file === undefined) {
            item = {
                ...item,
            }
            delete item.imageitem;
        }
        item = {
            ...item
        }
        return this.itemsService.create(item);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.itemsService.remove(+id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('imageitem', storageConfig("Items")))
    async update(@Param('id') id: string, @Req() req: any, @Body() item: Item, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }
        if (file) {
            item = {
                ...item,
                imageitem: file.path
            }
        }
        else if (file === undefined) {
            item = {
                ...item,
            }
            delete item.imageitem;
        }
        item = {
            ...item
        }
        await this.itemsService.update(Number(id), item)
        return {
            message: "Update " + item.name + " successfully"
        }
    }
}
