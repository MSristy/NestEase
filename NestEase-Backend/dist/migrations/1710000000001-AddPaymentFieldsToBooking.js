"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPaymentFieldsToBooking1710000000001 = void 0;
class AddPaymentFieldsToBooking1710000000001 {
    constructor() {
        this.name = "AddPaymentFieldsToBooking1710000000001";
    }
    async up(queryRunner) {
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
    async down(queryRunner) {
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
exports.AddPaymentFieldsToBooking1710000000001 = AddPaymentFieldsToBooking1710000000001;
//# sourceMappingURL=1710000000001-AddPaymentFieldsToBooking.js.map