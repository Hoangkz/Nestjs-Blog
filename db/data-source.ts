import { DataSourceOptions, DataSource } from "typeorm";
import * as dotenv from 'dotenv'
import { User } from "src/Model/user/Entity/user.entity";
import { Item } from "src/model/items/Entity/Items.entity";
import { Category } from "src/Model/category/Entity/Category.entity";
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: process.env.HOST_DB,
    port: +process.env.PORT_DB,
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
    entities: [User, Item, Category],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: true
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
