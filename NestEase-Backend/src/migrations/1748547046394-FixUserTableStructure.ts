import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserTableStructure1748547046394 implements MigrationInterface {
    name = 'FixUserTableStructure1748547046394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if user table exists, if not create it
        const hasUserTable = await queryRunner.hasTable('user');
        if (!hasUserTable) {
            await queryRunner.query(`
                CREATE TABLE \`user\` (
                    \`id\` int NOT NULL AUTO_INCREMENT,
                    \`email\` varchar(255) NOT NULL,
                    \`password\` varchar(255) NOT NULL,
                    \`name\` varchar(255) NOT NULL,
                    \`avatar\` varchar(255) NULL,
                    \`phone\` varchar(255) NULL,
                    \`address\` varchar(255) NULL,
                    \`role\` varchar(255) NOT NULL DEFAULT 'user',
                    \`isActive\` tinyint NOT NULL DEFAULT 1,
                    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    \`emailNotifications\` tinyint NOT NULL DEFAULT 1,
                    \`smsNotifications\` tinyint NOT NULL DEFAULT 0,
                    \`showProfile\` tinyint NOT NULL DEFAULT 1,
                    \`customization\` json NULL,
                    UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
                    PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB
            `);
        } else {
            // Add missing columns if they don't exist
            const hasNameColumn = await queryRunner.hasColumn('user', 'name');
            if (!hasNameColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`name\` varchar(255) NOT NULL DEFAULT ''`);
            }

            const hasAvatarColumn = await queryRunner.hasColumn('user', 'avatar');
            if (!hasAvatarColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
            }

            const hasPhoneColumn = await queryRunner.hasColumn('user', 'phone');
            if (!hasPhoneColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`phone\` varchar(255) NULL`);
            }

            const hasAddressColumn = await queryRunner.hasColumn('user', 'address');
            if (!hasAddressColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`address\` varchar(255) NULL`);
            }

            const hasRoleColumn = await queryRunner.hasColumn('user', 'role');
            if (!hasRoleColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
            }

            const hasIsActiveColumn = await queryRunner.hasColumn('user', 'isActive');
            if (!hasIsActiveColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
            }

            const hasCreatedAtColumn = await queryRunner.hasColumn('user', 'createdAt');
            if (!hasCreatedAtColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
            }

            const hasEmailNotificationsColumn = await queryRunner.hasColumn('user', 'emailNotifications');
            if (!hasEmailNotificationsColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`emailNotifications\` tinyint NOT NULL DEFAULT 1`);
            }

            const hasSmsNotificationsColumn = await queryRunner.hasColumn('user', 'smsNotifications');
            if (!hasSmsNotificationsColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`smsNotifications\` tinyint NOT NULL DEFAULT 0`);
            }

            const hasShowProfileColumn = await queryRunner.hasColumn('user', 'showProfile');
            if (!hasShowProfileColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`showProfile\` tinyint NOT NULL DEFAULT 1`);
            }

            const hasCustomizationColumn = await queryRunner.hasColumn('user', 'customization');
            if (!hasCustomizationColumn) {
                await queryRunner.query(`ALTER TABLE \`user\` ADD \`customization\` json NULL`);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This migration only adds columns, so we won't drop them in down
        // as it might cause data loss
    }
} 