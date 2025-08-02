import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropertyType1710000000000 implements MigrationInterface {
    name = 'AddPropertyType1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if type column already exists before adding it
        const hasTypeColumn = await queryRunner.hasColumn('property', 'type');
        if (!hasTypeColumn) {
            await queryRunner.query(`ALTER TABLE property ADD COLUMN type VARCHAR(255) NOT NULL DEFAULT 'rent'`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if type column exists before dropping it
        const hasTypeColumn = await queryRunner.hasColumn('property', 'type');
        if (hasTypeColumn) {
            await queryRunner.query(`ALTER TABLE property DROP COLUMN type`);
        }
    }
} 