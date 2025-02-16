import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Skill } from "./skill.entity";

@Entity('user_skills')
export class UserSkill {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  skill_id: number;

  @ManyToOne(() => User, user => user.userSkills)
  @JoinColumn({ name: 'user_id' }) // Explicitly define column name
  user: User;

  @ManyToOne(() => Skill, skill => skill.userSkills)
  @JoinColumn({ name: 'skill_id' }) // Explicitly define column name
  skill: Skill;
}
