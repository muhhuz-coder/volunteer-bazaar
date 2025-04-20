import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserQueryDto } from '../dto/user-query.dto';
import { EventService } from './event.service';
import { UserRole } from '../dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventService: EventService,
  ) {}


  async findAll(query: UserQueryDto): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (query.user_id) {
      queryBuilder.andWhere('user.user_id = :user_id', { user_id: query.user_id });
    }
    
    if (query.name) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${query.name}%` });
    }
    if (query.gender) {
      queryBuilder.andWhere('user.gender = :gender', { gender: query.gender });
    }
    if (query.age) {
      queryBuilder.andWhere('user.age = :age', { age: query.age });
    }
    if (query.city_id) {
      queryBuilder.andWhere('user.city_id = :city_id', { city_id: query.city_id });
    }
    if (query.province) {
      queryBuilder.andWhere('user.province LIKE :province', { province: `%${query.province}%` });
    }
    if (query.degree_id) {
      queryBuilder.andWhere('user.degree_id = :degree_id', { degree_id: query.degree_id });
    }
    if (query.field_id) {
      queryBuilder.andWhere('user.field_id = :field_id', { field_id: query.field_id });
    }
  
    // Include relations if needed
    queryBuilder.leftJoinAndSelect('user.city', 'city');
    queryBuilder.leftJoinAndSelect('user.degree', 'degree');
    queryBuilder.leftJoinAndSelect('user.field', 'field');
  
    return await queryBuilder.getMany();
  }
  
  
  async getUserStats(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['userEvents', 'userSkills'],
    });
  
    console.log("Fetched user:", user); // Debugging
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    return {
      totalEvents: user.userEvents ? user.userEvents.length : 0,
      skillsCount: user.userSkills ? user.userSkills.length : 0,
      rating: user.rating || 0,
      hoursCompleted: user.hours_completed || 0,
    };
  }

  async getUserProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['city', 'degree', 'field', 'userSkills', 'userSkills.skill', 'userCauses', 'userCauses.cause'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Remove password for security
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async updateUserProfile(userId: number, updateProfileDto: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Don't allow updating email, role or password through this endpoint
    const { email, role, password, ...allowedUpdates } = updateProfileDto;

    // Update user properties
    Object.assign(user, allowedUpdates);
    
    const updatedUser = await this.userRepository.save(user);
    
    // Remove password for security
    const { password: pwd, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async findUsersByRole(role: UserRole): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { role },
    });

    // Remove passwords for security
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }
}
