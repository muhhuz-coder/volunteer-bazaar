import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { UserQueryDto } from "../dto/user-query.dto";

import { ApiOperation } from "@nestjs/swagger";
import { TransformInterceptor } from "src/interceptors/transform.interceptor";
import { UserService } from "src/services/user.service";

// src/controllers/user.controller.ts
@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('stats/:id')
  @ApiOperation({ summary: 'Get user statistics' })
  getUserStats(@Param('id') id: string) {
    return this.userService.getUserStats(+id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users with filters' })
  searchUsers(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }
}
