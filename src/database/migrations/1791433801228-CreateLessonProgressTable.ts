import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLessonProgressTable1791433801228 implements MigrationInterface {
    name = 'CreateLessonProgressTable1791433801228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lesson_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid NOT NULL, "lesson_id" uuid NOT NULL, "is_complete" boolean NOT NULL DEFAULT false, "completed_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6223ebbc5f8f5fce40e0193de1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "lesson_progress"`);
    }

}
