import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

// src/entities/field.entity.ts
@Entity('fields')
export class Field {
  @PrimaryGeneratedColumn()
  field_id: number;

  @Column()
  field_name: string;

  @OneToMany(() => User, user => user.field)
  users: User[];
}