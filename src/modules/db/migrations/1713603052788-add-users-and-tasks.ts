import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersAndTasks1713603052788 implements MigrationInterface {
    name = 'AddUsersAndTasks1713603052788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_entity" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "task_entity" ADD "status" character varying NOT NULL DEFAULT 'OPEN'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_entity" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "task_entity" ADD "status" boolean NOT NULL`);
    }

}
