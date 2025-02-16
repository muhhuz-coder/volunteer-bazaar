import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEventType } from "./user-event-type.entity";
import { Event } from "./event.entity";


// src/entities/event-type.entity.ts
@Entity('event_types')
export class EventType {
  @PrimaryGeneratedColumn()
  event_type_id: number;

  @Column()
  event_type: string;

  @OneToMany(() => Event, event => event.eventType)
  events: Event[];

  @OneToMany(() => UserEventType, userEventType => userEventType.eventType)
  userEventTypes: UserEventType[];
}
