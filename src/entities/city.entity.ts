// src/entities/city.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';


@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  city_id: number;

  @Column()
  city_name: string;

  @Column()
  province: string;

  @OneToMany(() => User, user => user.city)
  users: User[];

  @OneToMany(() => Event, (event) => event.city)
  events: Event[];

}
