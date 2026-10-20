import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCourseMetadata1792463106226 implements MigrationInterface {
    name = 'AddCourseMetadata1792463106226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."courses_level_enum" AS ENUM('beginner', 'intermediate', 'advanced')`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "level" "public"."courses_level_enum" NOT NULL DEFAULT 'beginner'`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "duration" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "level"`);
        await queryRunner.query(`DROP TYPE "public"."courses_level_enum"`);
    }

}
