import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserSkill } from "./user-skill.entity";

// src/entities/skill.entity.ts
@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  skill_id: number;

  @Column()
  skill_name: string;

  @OneToMany(() => UserSkill, userSkill => userSkill.skill)
  userSkills: UserSkill[];
}