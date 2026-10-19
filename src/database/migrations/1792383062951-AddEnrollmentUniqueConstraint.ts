import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnrollmentUniqueConstraint1792383062951 implements MigrationInterface {
    name = 'AddEnrollmentUniqueConstraint1792383062951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "UQ_850389020f5faddd405e2792634" UNIQUE ("student_id", "course_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "UQ_850389020f5faddd405e2792634"`);
    }

}
