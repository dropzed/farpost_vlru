import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Пример миграции для справки
 * 
 * Для создания новой миграции используйте:
 * npm run migration:generate -- src/migrations/YourMigrationName
 * 
 * Эта миграция будет создана автоматически на основе изменений в ваших entities.
 */
export class ExampleMigration1234567890123 implements MigrationInterface {
    name = 'ExampleMigration1234567890123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Здесь TypeORM автоматически сгенерирует SQL для изменений
        // Например:
        // await queryRunner.query(`CREATE TABLE "example" ("id" SERIAL NOT NULL, CONSTRAINT "PK_..." PRIMARY KEY ("id"))`);
        
        console.log('This is an example migration - delete this file when you create real migrations');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Здесь должен быть SQL для отката изменений
        // Например:
        // await queryRunner.query(`DROP TABLE "example"`);
        
        console.log('Reverting example migration');
    }
}
