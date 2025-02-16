import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

// src/entities/degree.entity.ts
@Entity('degrees')
export class Degree {
  @PrimaryGeneratedColumn()
  degree_id: number;

  @Column()
  degree_name: string;

  @OneToMany(() => User, user => user.degree)
  users: User[];
}