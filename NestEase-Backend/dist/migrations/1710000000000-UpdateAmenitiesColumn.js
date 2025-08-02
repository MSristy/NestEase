"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAmenitiesColumn1710000000000 = void 0;
class UpdateAmenitiesColumn1710000000000 {
    async up(queryRunner) {
        // Fix amenities column to use JSON type instead of text
        await queryRunner.query(`
            ALTER TABLE property 
            MODIFY COLUMN amenities JSON DEFAULT NULL
        `);
        // Add bachelorFriendly column
        await queryRunner.query(`
            ALTER TABLE property 
            ADD COLUMN bachelorFriendly BOOLEAN DEFAULT FALSE
        `);
    }
    async down(queryRunner) {
        // Revert amenities column to text
        await queryRunner.query(`
            ALTER TABLE property 
            MODIFY COLUMN amenities TEXT DEFAULT NULL
        `);
        // Remove bachelorFriendly column
        await queryRunner.query(`
            ALTER TABLE property 
            DROP COLUMN bachelorFriendly
        `);
    }
}
exports.UpdateAmenitiesColumn1710000000000 = UpdateAmenitiesColumn1710000000000;
//# sourceMappingURL=1710000000000-UpdateAmenitiesColumn.js.map