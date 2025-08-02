"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAddSwapTable1717000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateAddSwapTable1717000000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "add_swap",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "title",
                    type: "varchar",
                },
                {
                    name: "category",
                    type: "varchar",
                },
                {
                    name: "transactionType",
                    type: "varchar",
                },
                {
                    name: "price",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    default: 0,
                },
                {
                    name: "condition",
                    type: "varchar",
                },
                {
                    name: "description",
                    type: "text",
                },
                {
                    name: "location",
                    type: "varchar",
                },
                {
                    name: "imageUrl",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable("add_swap");
    }
}
exports.CreateAddSwapTable1717000000000 = CreateAddSwapTable1717000000000;
//# sourceMappingURL=1717000000000-CreateAddSwapTable.js.map