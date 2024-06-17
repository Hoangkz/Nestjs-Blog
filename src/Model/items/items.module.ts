import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { Item } from './Entity/Items.entity';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    ConfigModule
  ],
  providers: [ItemsService],
  controllers: [ItemsController]
})
export class ItemsModule { }
