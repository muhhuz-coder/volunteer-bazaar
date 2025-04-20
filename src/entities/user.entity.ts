import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { UserEvent } from './user-event.entity';
import { UserCause } from './user-cause.entity';
import { Degree } from './degree.entity';
import { City } from './city.entity';
import { UserSkill } from './user-skill.entity';
import { Field } from './field.entity';
import { UserEventType } from './user-event-type.entity';
import { UserRole } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  province: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ nullable: true })
  university: string;

  @Column({ nullable: true })
  employment_status: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ default: 0 })
  reviews_received: number;

  @Column({ default: 0 })
  referral_count: number;

  @Column({ default: 0 })
  hours_completed: number;

  // New auth fields
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VOLUNTEER
  })
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // ✅ Corrected Foreign Key Relations
  @ManyToOne(() => City, city => city.users, { nullable: true })
  @JoinColumn({ name: 'city_id' }) // Ensures column matches database
  city: City;

  @ManyToOne(() => Degree, degree => degree.users, { nullable: true })
  @JoinColumn({ name: 'degree_id' }) // Ensures column matches database
  degree: Degree;

  @ManyToOne(() => Field, field => field.users, { nullable: true })
  @JoinColumn({ name: 'field_id' }) // Ensures column matches database
  field: Field;

  // ✅ One-to-Many Relationships
  @OneToMany(() => UserSkill, userSkill => userSkill.user)
  userSkills: UserSkill[];

  @OneToMany(() => UserEvent, userEvent => userEvent.user)
  userEvents: UserEvent[];

  @OneToMany(() => UserCause, userCause => userCause.user)
  userCauses: UserCause[];

  @OneToMany(() => UserEventType, userEventType => userEventType.user)
  userEventTypes: UserEventType[];
}
