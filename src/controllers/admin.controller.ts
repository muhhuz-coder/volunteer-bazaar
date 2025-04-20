import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../dto/auth.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('organizations/pending')
  @ApiOperation({ summary: 'Get pending organizations' })
  getPendingOrganizations() {
    return this.adminService.getPendingOrganizations();
  }

  @Post('organizations/:id/approve')
  @ApiOperation({ summary: 'Approve an organization' })
  approveOrganization(@Param('id') id: string) {
    return this.adminService.approveOrganization(+id);
  }

  @Post('organizations/:id/reject')
  @ApiOperation({ summary: 'Reject an organization' })
  rejectOrganization(@Param('id') id: string) {
    return this.adminService.rejectOrganization(+id);
  }

  @Get('volunteers/most-active')
  @ApiOperation({ summary: 'Get most active volunteers' })
  getMostActiveVolunteers() {
    return this.adminService.getMostActiveVolunteers();
  }

  @Get('events/most-popular')
  @ApiOperation({ summary: 'Get most popular events' })
  getMostPopularEvents() {
    return this.adminService.getMostPopularEvents();
  }
} 