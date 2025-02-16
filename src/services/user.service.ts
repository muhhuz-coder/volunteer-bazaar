import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserQueryDto } from '../dto/user-query.dto';
import { EventService } from './event.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventService: EventService,
  ) {}


  async findAll(query: UserQueryDto): Promise<User[]> {

    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.city', 'city')
      .leftJoinAndSelect('user.degree', 'degree')
      .leftJoinAndSelect('user.field', 'field');

    if (query.city_id) {
      queryBuilder.andWhere('city.city_id = :cityId', { cityId: query.city_id });
    }

    if (query.age) {
      queryBuilder.andWhere('user.age >= :age', { age: query.age });
    }


    return queryBuilder.getMany();
  }

  async getUserStats(userId: number): Promise<any> {

    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['userEvents', 'userSkills'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      totalEvents: user.userEvents.length,
      skillsCount: user.userSkills.length,
      rating: user.rating,
      hoursCompleted: user.hours_completed,
    };
  }
}
