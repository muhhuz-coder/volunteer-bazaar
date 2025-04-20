import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from '../controllers/admin.controller';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Event } from '../entities/event.entity';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';
import { EventService } from '../services/event.service';
import { OrganizationService } from '../services/organization.service';
import { UserEvent } from '../entities/user-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization, Event, UserEvent]),
  ],
  controllers: [AdminController],
  providers: [AdminService, UserService, EventService, OrganizationService],
})
export class AdminModule {} 