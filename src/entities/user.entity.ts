import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { UserEvent } from './user-event.entity';
import { UserCause } from './user-cause.entity';
import { Degree } from './degree.entity';
import { City } from './city.entity';
import { UserSkill } from './user-skill.entity';
import { Field } from './field.entity';
import { UserEventType } from './user-event-type.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  age: number;

  @Column()
  city_id: number;

  @Column()
  province: string;

  @Column()
  rating: number;

  @Column()
  degree_id: number;

  @Column()
  field_id: number;

  @Column()
  university: string;

  @Column()
  employment_status: string;

  @Column()
  bio: string;

  @Column()
  reviews_received: number;

  @Column()
  referral_count: number;

  @Column()
  hours_completed: number;

  @ManyToOne(() => City, city => city.users)
  city: City;

  @ManyToOne(() => Degree, degree => degree.users)
  degree: Degree;

  @ManyToOne(() => Field, field => field.users)
  field: Field;

  @OneToMany(() => UserSkill, userSkill => userSkill.user)
  userSkills: UserSkill[];

  @OneToMany(() => UserEvent, userEvent => userEvent.user)
  userEvents: UserEvent[];

  @OneToMany(() => UserCause, userCause => userCause.user)
  userCauses: UserCause[];

  @OneToMany(() => UserEventType, userEventType => userEventType.user)
  userEventTypes: UserEventType[];
}
