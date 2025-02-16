import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";


// src/entities/organization.entity.ts
@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  organization_id: number;

  @Column()
  organization_name: string;

  @OneToMany(() => Event, event => event.organization)
  events: Event[];
}
