import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { UserEvent } from '../entities/user-event.entity';
import { MoreThan } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(UserEvent) private userEventRepository: Repository<UserEvent>
  ) {}

  async findAll() {
    return await this.eventRepository.find();
  }
  

  async findOne(id: string | number) {
    console.log('Received ID:', id); // Debugging log
    
    const eventId = Number(id);
    
    if (isNaN(eventId) || !eventId) {
      throw new Error('Invalid event ID');
    }
  
    return await this.eventRepository.findOne({ where: { event_id: eventId } });
  }
    

  async getUpcomingEvents() {
    const currentDate = new Date();
  
    return await this.eventRepository
      .createQueryBuilder('event')
      .where('event.start_date > :currentDate', { currentDate })
      .orderBy('event.start_date', 'ASC') // Order by start date
      .getMany();
  }
  
  

  async getUserEvents(userId: number) {
    return await this.userEventRepository.find({
      where: { user_id: userId },
      relations: ['event'],
    });
  }

  async getPopularEvents() {
  return await this.eventRepository
    .createQueryBuilder('event')
    .leftJoinAndSelect('event.userEvents', 'userEvent')
    .groupBy('event.event_id') // Group by event_id to apply aggregate functions like COUNT()
    .orderBy('COUNT(userEvent.user_id)', 'DESC') // Order by the number of participants
    .limit(5) // Limit to top 5 most popular events
    .getMany();
}

  
  
  

  async checkUserParticipation(eventId: number, userId: number) {
    const participation = await this.userEventRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    return { isRegistered: !!participation };
  }

  async registerUser(eventId: number, userId: number) {
    const userEvent = this.userEventRepository.create({ event_id: eventId, user_id: userId });
    return await this.userEventRepository.save(userEvent);
  }

  async unregisterUser(eventId: number, userId: number) {
    return await this.userEventRepository.delete({ event_id: eventId, user_id: userId });
  }

  async create(eventData) {
    return await this.eventRepository.save(eventData);
  }

  async update(id: number, eventData) {
    return await this.eventRepository.update(id, eventData);
  }

  async remove(id: number) {
    return await this.eventRepository.delete(id);
  }
}
