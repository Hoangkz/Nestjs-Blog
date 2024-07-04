import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
} from 'class-validator';


export class CreateUserModel {
    @ApiProperty({ description: 'First name' })
    firstname: string;

    @ApiProperty({ description: 'First name' })
    lastname: string;

    @ApiProperty({ description: 'email' })
    email: string;

    @ApiProperty({ description: 'password' })
    password: string;

    @ApiProperty({ description: 'phone' })
    phone: string;

    @ApiProperty({ description: 'gender' })
    gender: string;

    @ApiProperty({ description: 'address' })
    address: string;

    @ApiProperty({ description: 'birthday' })
    birthday: Date;
}
