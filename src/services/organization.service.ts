import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "src/entities/organization.entity";
import { Repository } from "typeorm";
import { CreateOrganizationDto } from "../dto/create-organization.dto";


// src/services/organization.service.ts
@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  findAll() {
    return this.organizationRepository.find({
      relations: ['events'],
    });
  }

  findOne(id: number) {
    return this.organizationRepository.findOne({
      where: { organization_id: id },
      relations: ['events'],
    });
  }

  create(createOrganizationDto: CreateOrganizationDto) {
    const organization = this.organizationRepository.create(createOrganizationDto);
    return this.organizationRepository.save(organization);
  }
}
