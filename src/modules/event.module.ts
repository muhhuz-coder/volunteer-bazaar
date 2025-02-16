import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventController } from "src/controllers/event.controller";
import { EventService } from "src/services/event.service";

// src/modules/event.module.ts
@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
  })
  export class EventModule {}