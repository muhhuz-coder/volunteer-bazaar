import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { EventType } from "./event-type.entity";
import { User } from "./user.entity";

// src/entities/user-event-type.entity.ts
@Entity('user_event_types')
export class UserEventType {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  event_type_id: number;

  @ManyToOne(() => User, user => user.userEventTypes)
  user: User;

  @ManyToOne(() => EventType, eventType => eventType.userEventTypes)
  eventType: EventType;
}
