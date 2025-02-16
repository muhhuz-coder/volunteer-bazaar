import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Event } from "./event.entity";


// src/entities/user-event.entity.ts
@Entity('user_events')
export class UserEvent {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  event_id: number;

  @ManyToOne(() => User, user => user.userEvents)
  user: User;

  @ManyToOne(() => Event, event => event.userEvents)
  event: Event;
}
