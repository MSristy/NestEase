"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixAmenitiesAndAddBachelorFriendly1748547046392 = void 0;
class FixAmenitiesAndAddBachelorFriendly1748547046392 {
    async up(queryRunner) {
        // Fix amenities column to use JSON type instead of text
        await queryRunner.query(`
            ALTER TABLE property 
            MODIFY COLUMN amenities JSON DEFAULT NULL
        `);
    }
    async down(queryRunner) {
        // Revert amenities column to text
        await queryRunner.query(`
            ALTER TABLE property 
            MODIFY COLUMN amenities TEXT DEFAULT NULL
        `);
    }
}
exports.FixAmenitiesAndAddBachelorFriendly1748547046392 = FixAmenitiesAndAddBachelorFriendly1748547046392;
//# sourceMappingURL=1748547046392-FixAmenitiesAndAddBachelorFriendly.js.map