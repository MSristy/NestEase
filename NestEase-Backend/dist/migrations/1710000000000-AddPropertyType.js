"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPropertyType1710000000000 = void 0;
class AddPropertyType1710000000000 {
    constructor() {
        this.name = 'AddPropertyType1710000000000';
    }
    async up(queryRunner) {
        // Check if type column already exists before adding it
        const hasTypeColumn = await queryRunner.hasColumn('property', 'type');
        if (!hasTypeColumn) {
            await queryRunner.query(`ALTER TABLE property ADD COLUMN type VARCHAR(255) NOT NULL DEFAULT 'rent'`);
        }
    }
    async down(queryRunner) {
        // Check if type column exists before dropping it
        const hasTypeColumn = await queryRunner.hasColumn('property', 'type');
        if (hasTypeColumn) {
            await queryRunner.query(`ALTER TABLE property DROP COLUMN type`);
        }
    }
}
exports.AddPropertyType1710000000000 = AddPropertyType1710000000000;
//# sourceMappingURL=1710000000000-AddPropertyType.js.map