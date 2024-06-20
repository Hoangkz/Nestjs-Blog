import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 100, nullable: false, unique: true })
    email: string;

    @Column({ length: 20, nullable: false })
    firstname: string;

    @Column({ length: 20, nullable: false })
    lastname: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: 1 })
    role: number;

    @Column({ nullable: true })
    phone: string;

    @Column({ length: 10, nullable: true })
    gender: string;

    @Column({ length: 100, nullable: true })
    address: string;

    @Column({ type: 'date', nullable: true })
    birthday: Date;

    

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @Column({ type: 'text', nullable: true })
    accesstoken: string;

    @Column({ type: 'text', nullable: true })
    refreshtoken: string;
}
