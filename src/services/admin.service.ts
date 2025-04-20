import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Organization, OrganizationStatus } from '../entities/organization.entity';
import { Event } from '../entities/event.entity';
import { UserEvent } from '../entities/user-event.entity';
import { UserRole } from '../dto/auth.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(UserEvent)
    private userEventRepository: Repository<UserEvent>,
  ) {}

  async getDashboardStats(): Promise<any> {
    const totalUsers = await this.userRepository.count();
    const totalVolunteers = await this.userRepository.count({
      where: { role: UserRole.VOLUNTEER },
    });
    const totalOrganizations = await this.organizationRepository.count();
    const totalEvents = await this.eventRepository.count();
    const totalUserEvents = await this.userEventRepository.count();

    return {
      totalUsers,
      totalVolunteers,
      totalOrganizations,
      totalEvents,
      totalRegistrations: totalUserEvents,
    };
  }

  async getPendingOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.find({
      where: { status: OrganizationStatus.PENDING },
    });
  }

  async approveOrganization(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { organization_id: id },
    });
    
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    
    organization.status = OrganizationStatus.APPROVED;
    return this.organizationRepository.save(organization);
  }

  async rejectOrganization(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { organization_id: id },
    });
    
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    
    organization.status = OrganizationStatus.REJECTED;
    return this.organizationRepository.save(organization);
  }

  async getMostActiveVolunteers(limit: number = 5): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.VOLUNTEER },
      order: { hours_completed: 'DESC' },
      take: limit,
    });
  }

  async getMostPopularEvents(limit: number = 5): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.userEvents', 'userEvent')
      .groupBy('event.event_id')
      .orderBy('COUNT(userEvent.user_id)', 'DESC')
      .limit(limit)
      .getMany();
  }
} 