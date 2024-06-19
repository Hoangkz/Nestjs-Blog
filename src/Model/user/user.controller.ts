import { Controller, Get, Post, Delete, Param, Body, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './Entity/user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('search')
    search(@Query('q') query: string): Promise<User[]> {

        return this.userService.search(query);
    }

    @Get()
    findAll(@Query('page') page: number): Promise<User[]> {
        
        return this.userService.findAll(page);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @Post()
    create(@Body() user: User): Promise<User> {

        if (user.password.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }
        return this.userService.create(user);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() user: Partial<User>): Promise<User> {
        return this.userService.update(id, user);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.userService.remove(id);
    }


}
