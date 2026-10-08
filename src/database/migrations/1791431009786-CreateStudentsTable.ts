import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStudentsTable1791431009786 implements MigrationInterface {
    name = 'CreateStudentsTable1791431009786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."students_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullname" character varying(100) NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(20) NOT NULL, "password" character varying(255) NOT NULL, "avatar" character varying(255), "status" "public"."students_status_enum" NOT NULL DEFAULT 'active', "last_login_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fa8c3b4233deabc0917380ef4ef" UNIQUE ("username"), CONSTRAINT "UQ_25985d58c714a4a427ced57507b" UNIQUE ("email"), CONSTRAINT "UQ_317b86154bca256bdf5432f134c" UNIQUE ("phone"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TYPE "public"."students_status_enum"`);
    }

}
