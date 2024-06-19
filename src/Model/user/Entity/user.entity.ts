import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20, nullable: false })
    firstname: string;

    @Column({ length: 20, nullable: false })
    lastname: string;

    @Column({ nullable: false })
    password: string;
    @Column({ default: 1 })
    role: number;
    @Column()
    phone: string
    @Column({ length: 5 })
    gender: string
    @Column({ length: 100 })
    address: string
    @Column({ type: 'date', nullable: true })
    birthday: Date
    @Column({ length: 255, nullable: false, unique: true })
    email: string;
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @Column()
    accesstoken: string;
    @Column()
    refreshtoken: string;
}
