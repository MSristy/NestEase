"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveImageUrlFromAddSwap1748547046391 = void 0;
class RemoveImageUrlFromAddSwap1748547046391 {
    constructor() {
        this.name = "RemoveImageUrlFromAddSwap1748547046391";
    }
    async up(queryRunner) {
        const hasImageUrlColumn = await queryRunner.hasColumn("add_swap", "imageUrl");
        if (hasImageUrlColumn) {
            await queryRunner.query(`ALTER TABLE \`add_swap\` DROP COLUMN \`imageUrl\``);
        }
    }
    async down(queryRunner) {
        const hasImageUrlColumn = await queryRunner.hasColumn("add_swap", "imageUrl");
        if (!hasImageUrlColumn) {
            await queryRunner.query(`ALTER TABLE \`add_swap\` ADD \`imageUrl\` varchar(255)`);
        }
    }
}
exports.RemoveImageUrlFromAddSwap1748547046391 = RemoveImageUrlFromAddSwap1748547046391;
//# sourceMappingURL=1748547046391-RemoveImageUrlFromAddSwap.js.map