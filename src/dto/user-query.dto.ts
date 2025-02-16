import { IsOptional, IsString, IsNumber } from 'class-validator';

export class 

UserQueryDto {
  @IsOptional()
  @IsString()
  user_id?: number;


  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  city_id?: number;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  degree_id?: number;

  @IsOptional()
  @IsNumber()
  field_id?: number;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  employment_status?: string;

  @IsOptional()
  @IsNumber()
  referral_count?: number;

  @IsOptional()
  @IsNumber()
  hours_completed?: number;

  @IsOptional()
  @IsNumber()
  cause_id?: number;

  @IsOptional()
  @IsNumber()
  event_type_id?: number;

  @IsOptional()
  @IsNumber()
  skill_id?: number;
}
