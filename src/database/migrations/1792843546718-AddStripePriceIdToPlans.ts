import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStripePriceIdToPlans1792843546718 implements MigrationInterface {
    name = 'AddStripePriceIdToPlans1792843546718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plans" ADD "stripe_price_id" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plans" ADD CONSTRAINT "UQ_fd5ce3c5becb7f6ec3c847ca906" UNIQUE ("stripe_price_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plans" DROP CONSTRAINT "UQ_fd5ce3c5becb7f6ec3c847ca906"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "stripe_price_id"`);
    }

}
