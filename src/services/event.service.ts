
  // SERVICES

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { createEventDto } from "../dto/create-event.dto";
import { updateEventDto } from "../dto/update-event.dto";



  // src/services/event.service.ts
  @Injectable()
  export class EventService {
    constructor(
      @InjectRepository(Event)
      private eventRepository: Repository<Event>,
    ) {}
  
    findAll() {
      return this.eventRepository.find({
        relations: ['city', 'organization', 'eventType'],
      });
    }
  
    findOne(id: number) {
      return this.eventRepository.findOne({
      where: { event_id: id },


        relations: ['city', 'organization', 'eventType'],
      });
    }
  
    create(createEventDto: createEventDto) {

      const event = this.eventRepository.create(createEventDto as Event);

      return this.eventRepository.save(event);
    }
  
    update(id: number, updateEventDto: updateEventDto) {

      return this.eventRepository.update(id, updateEventDto as Partial<Event>);

    }
  
    remove(id: number) {
      return this.eventRepository.delete(id);
    }
  }
