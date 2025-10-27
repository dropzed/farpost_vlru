import {ConfigService} from "@nestjs/config";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export async function getTypeOrmConfig(configService: ConfigService): Promise<TypeOrmModuleOptions> {
    const isProduction = configService.get('NODE_ENV') === 'production';
    
    return {
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: configService.getOrThrow<number>('POSTGRES_PORT'),
        username: configService.getOrThrow<string>('POSTGRES_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        migrationsRun: isProduction, // Auto-run migrations in production
        synchronize: !isProduction, // false in production for safety
        autoLoadEntities: true,
        logging: isProduction ? ['error', 'warn', 'migration'] : true,
    }
}