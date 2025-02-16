import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  city_id: number;

  @Column()
  organization_id: number;

  @Column()
  rating: number;

  @ManyToOne(() => City, city => city.events)
  city: City;

  @ManyToOne(() => Organization, org => org.events)
  organization: Organization;

  @ManyToOne(() => EventType, eventType => eventType.events)
  eventType: EventType;

  @OneToMany(() => UserEvent, userEvent => userEvent.event)
  userEvents: UserEvent[];
}
