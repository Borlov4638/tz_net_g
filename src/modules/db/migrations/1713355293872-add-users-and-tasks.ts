import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsers1713355293872 implements MigrationInterface {
    name = 'AddUsers1713355293872';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "task_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "status" boolean NOT NULL, "author" uuid NOT NULL, CONSTRAINT "PK_0385ca690d1697cdf7ff1ed3c2f" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "task_entity" ADD CONSTRAINT "FK_b076a2a4a67948efd49ec4d814a" FOREIGN KEY ("author") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "task_entity" DROP CONSTRAINT "FK_b076a2a4a67948efd49ec4d814a"`,
        );
        await queryRunner.query(`DROP TABLE "task_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }
}
