import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCancelAtPeriodEnd1792777864747 implements MigrationInterface {
    name = 'AddCancelAtPeriodEnd1792777864747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "cancel_at_period_end" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "cancel_at_period_end"`);
    }

}
