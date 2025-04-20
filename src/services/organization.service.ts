import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { Event } from '../entities/event.entity';
import { CreateOrganizationDto } from "../dto/create-organization.dto";


// src/services/organization.service.ts
@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Organization[]> {
    return await this.organizationRepository.find();
  }

  async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { organization_id: id },
    });
    
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    
    return organization;
  }

  async create(createOrganizationDto: DeepPartial<Organization>): Promise<Organization> {
    // Create a new organization entity
    const newOrganization = this.organizationRepository.create(createOrganizationDto);
    
    // TypeORM's save method returns the entity type for a single entity
    return await this.organizationRepository.save(newOrganization) as Organization;
  }

  async update(id: number, updateOrganizationDto: DeepPartial<Organization>): Promise<Organization> {
    // First check if the organization exists
    const organization = await this.findOne(id);
    
    // Update properties
    Object.assign(organization, updateOrganizationDto);
    
    // TypeORM's save method returns the entity type for a single entity
    return await this.organizationRepository.save(organization) as Organization;
  }

  async remove(id: number): Promise<void> {
    const organization = await this.findOne(id);
    await this.organizationRepository.remove(organization);
  }

  async getOrganizationEvents(organizationId: number): Promise<Event[]> {
    // Find organization to ensure it exists
    await this.findOne(organizationId);
    
    // Get all events for the organization
    return await this.eventRepository.find({
      where: { organization_id: organizationId },
    });
  }
}
