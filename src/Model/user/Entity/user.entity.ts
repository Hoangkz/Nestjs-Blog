import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20, nullable: false })
    firstname: string;

    @Column({ length: 20, nullable: false })
    lastname: string;

    @Column({ length: 255, nullable: false })
    password: string;

    @Column({ length: 255, nullable: false, unique: true })
    email: string;
}
