import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAddSwapTable1717000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
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
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("add_swap");
    }
} 