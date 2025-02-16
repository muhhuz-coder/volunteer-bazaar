import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Event } from "./event.entity";

// src/entities/user-event.entity.ts
@Entity('user_events')
export class UserEvent {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  event_id: number;

  @ManyToOne(() => User, user => user.userEvents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })  // Ensures correct FK mapping
  user: User;

  @ManyToOne(() => Event, event => event.userEvents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })  // Ensures correct FK mapping
  event: Event;
}
