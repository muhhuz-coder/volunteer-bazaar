import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class createEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  event_type_id: number;

  @IsNotEmpty()
  @Type(() => Date)  // ✅ Transform string to Date
  @IsDate()
  start_date: Date;

  @IsNotEmpty()
  @Type(() => Date)  // ✅ Transform string to Date
  @IsDate()
  end_date: Date;

  @IsNotEmpty()
  @IsString()
  start_time: string;

  @IsNotEmpty()
  @IsString()
  end_time: string;

  @IsNotEmpty()
  @IsNumber()
  city_id: number;

  @IsNotEmpty()
  @IsNumber()
  organization_id: number;

  @IsNotEmpty()
  @IsNumber()
  rating: number;
}
