import { PartialType } from '@nestjs/mapped-types';
import { createEventDto } from './create-event.dto';

export class updateEventDto extends PartialType(createEventDto) {}
