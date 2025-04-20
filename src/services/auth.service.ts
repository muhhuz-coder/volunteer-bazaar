import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto, SignupDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<any> {
    // Check if user already exists
    const userExists = await this.userRepository.findOne({
      where: { email: signupDto.email },
    });

    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create new user
    const user = this.userRepository.create(signupDto);
    const savedUser = await this.userRepository.save(user);
    
    // Remove password from response
    const { password, ...result } = savedUser;
    
    // Generate token
    const token = this.generateToken(savedUser);
    
    return {
      user: result,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password from response
    const { password, ...result } = user;
    
    // Generate token
    const token = this.generateToken(user);
    
    return {
      user: result,
      token,
    };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
    };
    
    return this.jwtService.sign(payload);
  }

  async validateUser(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { user_id: id } });
  }
} 