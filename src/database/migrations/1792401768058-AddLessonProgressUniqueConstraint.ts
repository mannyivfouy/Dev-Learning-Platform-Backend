import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLessonProgressUniqueConstraint1792401768058 implements MigrationInterface {
    name = 'AddLessonProgressUniqueConstraint1792401768058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_progress" ADD CONSTRAINT "UQ_92ed7bfa98a32eab1a62f206dd9" UNIQUE ("student_id", "lesson_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_progress" DROP CONSTRAINT "UQ_92ed7bfa98a32eab1a62f206dd9"`);
    }

}
