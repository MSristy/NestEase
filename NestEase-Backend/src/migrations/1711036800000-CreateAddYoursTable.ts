import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAddYoursTable1711036800000 implements MigrationInterface {
    name = 'CreateAddYoursTable1711036800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE add_yours (
                id INT NOT NULL AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(50) NOT NULL,
                transaction_type VARCHAR(20) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                item_condition VARCHAR(50) NOT NULL,
                description TEXT NOT NULL,
                location VARCHAR(255) NOT NULL,
                image_url VARCHAR(255) NOT NULL,
                owner_id INT NOT NULL,
                owner_name VARCHAR(255) NOT NULL,
                swap_value DECIMAL(10,2) NULL,
                discount INT NULL,
                original_price DECIMAL(10,2) NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'active',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE add_yours`);
    }
} 