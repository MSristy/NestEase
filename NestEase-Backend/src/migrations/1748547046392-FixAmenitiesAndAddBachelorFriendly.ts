import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAmenitiesAndAddBachelorFriendly1748547046392 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Fix amenities column to use JSON type instead of text
        await queryRunner.query(`
            ALTER TABLE property 
            MODIFY COLUMN amenities JSON DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert amenities column to text
        await queryRunner.query(`
            ALTER TABLE property 
            MODIFY COLUMN amenities TEXT DEFAULT NULL
        `);
    }
}
