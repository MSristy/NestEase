"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserRole1710000000000 = void 0;
class AddUserRole1710000000000 {
    constructor() {
        this.name = 'AddUserRole1710000000000';
    }
    async up(queryRunner) {
        // Check if role column already exists before adding it
        const hasRoleColumn = await queryRunner.hasColumn('user', 'role');
        if (!hasRoleColumn) {
            await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
        }
    }
    async down(queryRunner) {
        // Check if role column exists before dropping it
        const hasRoleColumn = await queryRunner.hasColumn('user', 'role');
        if (hasRoleColumn) {
            await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        }
    }
}
exports.AddUserRole1710000000000 = AddUserRole1710000000000;
//# sourceMappingURL=1710000000000-AddUserRole.js.map