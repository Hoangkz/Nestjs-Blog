import { Controller, Get, Post, Delete, Param, Body, Put, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './Entity/user.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserModel } from './Model/CreateUserModel';

@ApiTags('ms-user')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('search')
    search(@Query('page') page: number, @Query('q') query: string): Promise<any> {
        return this.userService.search(page, query);
    }
    @Delete('many')

    @UsePipes(new ValidationPipe({ transform: true }))
    async deleteMany(@Body() deleteMany: any): Promise<any> {
        const listId = deleteMany?.data?.listid
        return this.userService.deletemany(listId);

    }

    @Post('forgot-password')
    @UsePipes(new ValidationPipe({ transform: true }))
    async forgotPassword(@Body() email: any): Promise<any> {
        await this.userService.ForgotPassword(email)
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
    @ApiBody({
        type: CreateUserModel
    })
    create(@Body() user: User): Promise<User> {

        if (user.password.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }
        return this.userService.create(user);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() user: User): Promise<any> {

        return this.userService.update(id, user);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.userService.remove(id);
    }


}
