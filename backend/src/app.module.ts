import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {getTypeOrmConfig} from "./config/typeorm.config";
import {cacheConfig} from "./config/cache.config";
import { BlackoutsModule } from './blackouts/blackouts.module';
import { CountBlackoutsModule } from './count_blackouts/count_blackouts.module';
import { BlackoutsMapInfoModule } from './blackouts_map_info/blackouts_map_info.module';
import { CommonModule } from './common/common.module';


@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.NODE_ENV === 'production' 
            ? '../.env.production' 
            : '../.env.development',
      },),
      CacheModule.registerAsync({
          isGlobal: true,
          imports: [ConfigModule],
          useFactory: cacheConfig,
          inject: [ConfigService],
      }),
      TypeOrmModule.forRootAsync({
          imports: [
              ConfigModule,
          ],
          useFactory: getTypeOrmConfig,
          inject: [ConfigService],
      }),
      CommonModule,
      BlackoutsModule,
      CountBlackoutsModule,
      BlackoutsMapInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
