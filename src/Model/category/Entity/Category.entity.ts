
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Item } from 'src/model/items/Entity/Items.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    name: string;

    @OneToMany(() => Item, item => item.category)
    items: Item[];
}
