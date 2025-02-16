import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "src/controllers/user.controller";
import { User } from "src/entities/user.entity";
import { EventService } from "src/services/event.service";
import { UserService } from "src/services/user.service";
import { EventModule } from "./event.module";

// src/modules/user.module.ts
@Module({
    imports: [TypeOrmModule.forFeature([User]),EventModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
  })
  export class UserModule {}