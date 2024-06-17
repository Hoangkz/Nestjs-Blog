import { DataSourceOptions, DataSource } from "typeorm";
import * as dotenv from 'dotenv'
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: process.env.HOST_DB,
    port: +process.env.USERNAME_DB,
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
