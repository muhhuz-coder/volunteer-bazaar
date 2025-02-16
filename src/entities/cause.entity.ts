import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserCause } from "./user-cause.entity";

// src/entities/cause.entity.ts
@Entity('causes')
export class Cause {
  @PrimaryGeneratedColumn()
  cause_id: number;

  @Column()
  cause_name: string;

  @OneToMany(() => UserCause, userCause => userCause.cause)
  userCauses: UserCause[];
}
