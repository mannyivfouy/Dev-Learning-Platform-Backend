import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLessonUniqueConstraints1792379414285 implements MigrationInterface {
    name = 'AddLessonUniqueConstraints1792379414285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "UQ_622924f19a22f523e0163a21b14" UNIQUE ("course_id", "slug")`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "UQ_a2c7bea2354825a18778f658707" UNIQUE ("course_id", "lesson_order")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "UQ_a2c7bea2354825a18778f658707"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "UQ_622924f19a22f523e0163a21b14"`);
    }

}
