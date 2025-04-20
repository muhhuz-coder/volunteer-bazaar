import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new organization' })
  create(@Body() createOrganizationDto: any) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an organization' })
  update(@Param('id') id: string, @Body() updateOrganizationDto: any) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an organization' })
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Get organization events' })
  getOrganizationEvents(@Param('id') id: string) {
    return this.organizationService.getOrganizationEvents(+id);
  }
} 