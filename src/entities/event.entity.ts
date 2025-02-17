import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Organization } from './organization.entity';
import { EventType } from './event-type.entity';
import { UserEvent } from './user-event.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  event_id: number;

  @Column()
  title: string;

  @Column()
  event_type_id: number;

  @Column({ type: 'date' })  // Ensures only date is stored
  start_date: Date;

  @Column({ type: 'date' })  
  end_date: Date;

  @Column({ type: 'time' })  // Ensures only time is stored
  start_time: string;

  @Column({ type: 'time' })  
  end_time: string;

  @Column()
  city_id: number;

  @Column()
  organization_id: number;

  @Column({ type: 'float', nullable: true })  // Allows decimal values and can be null
  rating: number;

  // Explicitly defining the foreign key relationships
  @ManyToOne(() => City, (city) => city.events, { eager: false })
  @JoinColumn({ name: 'city_id' }) // Ensures proper column mapping
  city: City;

  @ManyToOne(() => Organization, (org) => org.events, { eager: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => EventType, (eventType) => eventType.events, { eager: false })
  @JoinColumn({ name: 'event_type_id' })
  eventType: EventType;

  @OneToMany(() => UserEvent, (userEvent) => userEvent.event)
  userEvents: UserEvent[];
}
