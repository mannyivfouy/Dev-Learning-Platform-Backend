import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlansTable1791434315296 implements MigrationInterface {
    name = 'CreatePlansTable1791434315296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."plans_billing_cycle_enum" AS ENUM('monthly', 'yearly')`);
        await queryRunner.query(`CREATE TYPE "public"."plans_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'USD', "billing_cycle" "public"."plans_billing_cycle_enum" NOT NULL, "status" "public"."plans_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_253d25dae4c94ee913bc5ec4850" UNIQUE ("name"), CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP TYPE "public"."plans_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."plans_billing_cycle_enum"`);
    }

}
