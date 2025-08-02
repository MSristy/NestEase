"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixAmenitiesAndAddBachelorFriendly1748547046393 = void 0;
class FixAmenitiesAndAddBachelorFriendly1748547046393 {
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
exports.FixAmenitiesAndAddBachelorFriendly1748547046393 = FixAmenitiesAndAddBachelorFriendly1748547046393;
//# sourceMappingURL=1748547046393-FixAmenitiesAndAddBachelorFriendly.js.map