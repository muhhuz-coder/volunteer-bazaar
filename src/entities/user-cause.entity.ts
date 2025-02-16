import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Cause } from "./cause.entity";
import { User } from "./user.entity";

// src/entities/user-cause.entity.ts
@Entity('user_causes')
export class UserCause {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  cause_id: number;

  @ManyToOne(() => User, user => user.userCauses)
  user: User;

  @ManyToOne(() => Cause, cause => cause.userCauses)
  cause: Cause;
}
