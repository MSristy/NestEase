import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveImageUrlFromAddSwap1748547046391 implements MigrationInterface {
    name = "RemoveImageUrlFromAddSwap1748547046391"

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasImageUrlColumn = await queryRunner.hasColumn("add_swap", "imageUrl");
        if (hasImageUrlColumn) {
            await queryRunner.query(`ALTER TABLE \`add_swap\` DROP COLUMN \`imageUrl\``);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasImageUrlColumn = await queryRunner.hasColumn("add_swap", "imageUrl");
        if (!hasImageUrlColumn) {
            await queryRunner.query(`ALTER TABLE \`add_swap\` ADD \`imageUrl\` varchar(255)`);
        }
    }
}
