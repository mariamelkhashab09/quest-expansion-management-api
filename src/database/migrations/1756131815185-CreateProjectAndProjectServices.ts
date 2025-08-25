import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectAndProjectServices1756131815185 implements MigrationInterface {
    name = 'CreateProjectAndProjectServices1756131815185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project\` (\`id\` int NOT NULL AUTO_INCREMENT, \`client_id\` int NOT NULL, \`country_id\` int NOT NULL, \`budget\` decimal(12,2) NOT NULL, \`status_id\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_services\` (\`project_id\` int NOT NULL, \`service_id\` int NOT NULL, INDEX \`IDX_ed6d4efd05c4874e848ea93b60\` (\`project_id\`), INDEX \`IDX_c8c7f6ad9c09772cfa926da2d7\` (\`service_id\`), PRIMARY KEY (\`project_id\`, \`service_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_c72d76e480d7334858782543610\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_323b33c985d0428606c25cff755\` FOREIGN KEY (\`country_id\`) REFERENCES \`country\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_625ed5469429a6b32e34ba9f827\` FOREIGN KEY (\`status_id\`) REFERENCES \`project_status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_services\` ADD CONSTRAINT \`FK_ed6d4efd05c4874e848ea93b603\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`project_services\` ADD CONSTRAINT \`FK_c8c7f6ad9c09772cfa926da2d78\` FOREIGN KEY (\`service_id\`) REFERENCES \`service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_services\` DROP FOREIGN KEY \`FK_c8c7f6ad9c09772cfa926da2d78\``);
        await queryRunner.query(`ALTER TABLE \`project_services\` DROP FOREIGN KEY \`FK_ed6d4efd05c4874e848ea93b603\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_625ed5469429a6b32e34ba9f827\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_323b33c985d0428606c25cff755\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_c72d76e480d7334858782543610\``);
        await queryRunner.query(`DROP INDEX \`IDX_c8c7f6ad9c09772cfa926da2d7\` ON \`project_services\``);
        await queryRunner.query(`DROP INDEX \`IDX_ed6d4efd05c4874e848ea93b60\` ON \`project_services\``);
        await queryRunner.query(`DROP TABLE \`project_services\``);
        await queryRunner.query(`DROP TABLE \`project\``);
    }

}
