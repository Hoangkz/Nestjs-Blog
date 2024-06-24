import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { Item } from './Entity/Items.entity';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from '../category/categories.module';
import { LoggerMiddleware } from 'src/logger/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    ConfigModule,
    CategoriesModule
  ],
  providers: [ItemsService],
  controllers: [ItemsController]
})
export class ItemsModule { }
