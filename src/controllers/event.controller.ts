import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { createEventDto } from '../dto/create-event.dto';  // Ensure correct relative import
import { EventService } from '../services/event.service';
import { updateEventDto } from 'src/dto/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Post()
  create(@Body() createEventDto: createEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventDto: updateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
