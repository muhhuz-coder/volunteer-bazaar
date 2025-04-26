import { 
  Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, Query 
} from '@nestjs/common';
import { createEventDto } from '../dto/create-event.dto';
import { updateEventDto } from 'src/dto/update-event.dto';
import { EventService } from '../services/event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

 
  
  @Get(':eventId/user/:userId/participation')
  checkUserParticipation(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.eventService.checkUserParticipation(+eventId, +userId);
  }

  @Get('/user/:userId')
  getUserEvents(@Param('userId') userId: string) {
    return this.eventService.getUserEvents(+userId);
  }
  
  @Get('/upcoming')
async getUpcomingEvents() {
  try {
    console.log("Fetching upcoming events...");
    const events = await this.eventService.getUpcomingEvents();
    console.log("Upcoming Events:", events);
    return events;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw new InternalServerErrorException("Failed to fetch upcoming events");
  }
}

@Get('/popular')
async getPopularEvents() {
  try {
    console.log("Fetching popular events...");
    const events = await this.eventService.getPopularEvents();
    console.log("Popular Events:", events);
    return events;
  } catch (error) {
    console.error("Error fetching popular events:", error);
    throw new InternalServerErrorException("Failed to fetch popular events");
  }
}

  @Get(':id')
async findOne(@Param('id') id: string) {
  return this.eventService.findOne(id);
}
@Get()
async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
  return await this.eventService.findAll();
}

  @Post()
  create(@Body() createEventDto: createEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Post(':eventId/register/:userId')
  registerUser(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.eventService.registerUser(+eventId, +userId);
  }

  @Delete(':eventId/unregister/:userId')
  unregisterUser(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.eventService.unregisterUser(+eventId, +userId);
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
