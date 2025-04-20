import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, SignupDto } from '../dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Create a new user account with the provided information. Returns user data and authentication token.'
  })
  @ApiBody({
    type: SignupDto,
    description: 'User registration information',
    examples: {
      volunteer: {
        summary: 'Volunteer signup example',
        value: {
          name: 'John Doe',
          email: 'volunteer@example.com',
          password: 'password123',
          role: 'volunteer',
          gender: 'male',
          age: 28,
          bio: 'I am passionate about helping others!'
        }
      },
      organization: {
        summary: 'Organization signup example',
        value: {
          name: 'Green Earth Foundation',
          email: 'org@example.com',
          password: 'password123',
          role: 'organization'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created.',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            user_id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        },
        token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data or email already exists.' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Authenticate a user',
    description: 'Login with email and password to receive an authentication token.'
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully authenticated.',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            user_id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        },
        token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
} 