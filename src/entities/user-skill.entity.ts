import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Skill } from "./skill.entity";

// src/entities/user-skill.entity.ts
@Entity('user_skills')
export class UserSkill {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  skill_id: number;

  @ManyToOne(() => User, user => user.userSkills)
  user: User;

  @ManyToOne(() => Skill, skill => skill.userSkills)
  skill: Skill;
}
