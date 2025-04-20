import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { UserModule } from './modules/user.module'; // Ensure correct path
import { EventModule } from './modules/event.module';
import { HealthController } from './controllers/health.controller';
import { AuthModule } from './modules/auth.module';
import { OrganizationModule } from './modules/organization.module';
import { AdminModule } from './modules/admin.module';
import { DocumentationController } from './controllers/documentation.controller';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), '.env'),
      cache: false,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    EventModule,
    AuthModule,
    OrganizationModule,
    AdminModule,
  ],
  controllers: [HealthController, DocumentationController],
  providers: [ConfigService],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    // Log config values for debugging
    console.log('Config Service Values:', {
      DB_HOST: this.configService.get('DB_HOST'),
      DB_USERNAME: this.configService.get('DB_USERNAME') ? '[USERNAME SET]' : '[NO USERNAME]',
      DB_DATABASE: this.configService.get('DB_DATABASE'),
    });
  }
}
