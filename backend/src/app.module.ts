import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getTypeOrmConfig} from "./config/typeorm.config";
import { BlackoutsModule } from './blackouts/blackouts.module';
import { CountBlackoutsModule } from './count_blackouts/count_blackouts.module';


@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.development', '.env.production'],
      },),
      TypeOrmModule.forRootAsync({
          imports: [
              ConfigModule,
          ],
          useFactory: getTypeOrmConfig,
          inject: [ConfigService],
      }),
      BlackoutsModule,
      CountBlackoutsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
