import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1710000000000 implements MigrationInterface {
    name = 'AddUserRole1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if role column already exists before adding it
        const hasRoleColumn = await queryRunner.hasColumn('user', 'role');
        if (!hasRoleColumn) {
            await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if role column exists before dropping it
        const hasRoleColumn = await queryRunner.hasColumn('user', 'role');
        if (hasRoleColumn) {
            await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        }
    }
} 