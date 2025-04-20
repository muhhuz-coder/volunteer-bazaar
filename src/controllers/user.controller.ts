import { Body, Controller, Get, Param, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserQueryDto } from "../dto/user-query.dto";

import { ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { TransformInterceptor } from "src/interceptors/transform.interceptor";
import { UserService } from "src/services/user.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../dto/auth.dto";
import { RolesGuard } from "../guards/roles.guard";

// src/controllers/user.controller.ts
@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getUsers() {
    return this.userService.findAll({});
  }

  @Get('stats/:id')
  @ApiOperation({ summary: 'Get user statistics' })
  getUserStats(@Param('id') id: number) {
    return this.userService.getUserStats(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users with filters' })
  searchUsers(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }

  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  getUserProfile(@Param('id') id: number) {
    return this.userService.getUserProfile(id);
  }

  @Put('profile/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  updateUserProfile(@Param('id') id: number, @Body() updateProfileDto: any) {
    return this.userService.updateUserProfile(id, updateProfileDto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admin users' })
  getAdminUsers() {
    return this.userService.findUsersByRole(UserRole.ADMIN);
  }

  @Get('volunteers')
  @ApiOperation({ summary: 'Get all volunteer users' })
  getVolunteerUsers() {
    return this.userService.findUsersByRole(UserRole.VOLUNTEER);
  }

  @Get('organizations')
  @ApiOperation({ summary: 'Get all organization users' })
  getOrganizationUsers() {
    return this.userService.findUsersByRole(UserRole.ORGANIZATION);
  }
}
