import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventController } from "src/controllers/event.controller";
import { EventService } from "src/services/event.service";
import { UserService } from "src/services/user.service";
import { Event } from "src/entities/event.entity";


// src/modules/event.module.ts
@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
  })
  export class EventModule {}