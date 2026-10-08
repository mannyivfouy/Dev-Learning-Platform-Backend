import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEnrollmentsTable1791433429711 implements MigrationInterface {
    name = 'CreateEnrollmentsTable1791433429711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."enrollments_source_enum" AS ENUM('purchase', 'subscription')`);
        await queryRunner.query(`CREATE TYPE "public"."enrollments_status_enum" AS ENUM('active', 'expired', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "enrollments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid NOT NULL, "course_id" uuid NOT NULL, "source" "public"."enrollments_source_enum" NOT NULL, "status" "public"."enrollments_status_enum" NOT NULL DEFAULT 'active', "enrolled_at" TIMESTAMP NOT NULL, "expires_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "enrollments"`);
        await queryRunner.query(`DROP TYPE "public"."enrollments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."enrollments_source_enum"`);
    }

}
