import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscriptionsTable1791444985600 implements MigrationInterface {
    name = 'CreateSubscriptionsTable1791444985600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_provider_enum" AS ENUM('stripe', 'paypal', 'bakong')`);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('pending', 'active', 'past_due', 'cancelled', 'expired')`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid NOT NULL, "plan_id" uuid NOT NULL, "provider" "public"."subscriptions_provider_enum" NOT NULL, "provider_customer_id" character varying(255), "provider_subscription_id" character varying(255), "status" "public"."subscriptions_status_enum" NOT NULL DEFAULT 'pending', "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "cancelled_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_provider_enum"`);
    }

}
