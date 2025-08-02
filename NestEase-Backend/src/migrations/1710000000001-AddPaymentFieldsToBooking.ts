import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentFieldsToBooking1710000000001 implements MigrationInterface {
    name = "AddPaymentFieldsToBooking1710000000001"

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if booking table exists and add payment fields
        const hasBookingTable = await queryRunner.hasTable("booking");
        if (hasBookingTable) {
            const hasPaymentStatus = await queryRunner.hasColumn("booking", "paymentStatus");
            if (!hasPaymentStatus) {
                await queryRunner.query(`ALTER TABLE \`booking\` ADD \`paymentStatus\` varchar(255) NOT NULL DEFAULT "pending"`);
            }
            
            const hasPaymentMethod = await queryRunner.hasColumn("booking", "paymentMethod");
            if (!hasPaymentMethod) {
                await queryRunner.query(`ALTER TABLE \`booking\` ADD \`paymentMethod\` varchar(255) NOT NULL DEFAULT "pending"`);
            }
            
            const hasBillId = await queryRunner.hasColumn("booking", "billId");
            if (!hasBillId) {
                await queryRunner.query(`ALTER TABLE \`booking\` ADD \`billId\` varchar(255)`);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasBookingTable = await queryRunner.hasTable("booking");
        if (hasBookingTable) {
            const hasBillId = await queryRunner.hasColumn("booking", "billId");
            if (hasBillId) {
                await queryRunner.query(`ALTER TABLE \`booking\` DROP COLUMN \`billId\``);
            }
            
            const hasPaymentMethod = await queryRunner.hasColumn("booking", "paymentMethod");
            if (hasPaymentMethod) {
                await queryRunner.query(`ALTER TABLE \`booking\` DROP COLUMN \`paymentMethod\``);
            }
            
            const hasPaymentStatus = await queryRunner.hasColumn("booking", "paymentStatus");
            if (hasPaymentStatus) {
                await queryRunner.query(`ALTER TABLE \`booking\` DROP COLUMN \`paymentStatus\``);
            }
        }
    }
}
