"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAddressAndConnectedAccount1683234567890 = void 0;
const typeorm_1 = require("typeorm");
class CreateAddressAndConnectedAccount1683234567890 {
    async up(queryRunner) {
        // Drop existing tables if they exist
        const addressTableExists = await queryRunner.hasTable('address');
        if (addressTableExists) {
            await queryRunner.dropTable('address');
        }
        const connectedAccountTableExists = await queryRunner.hasTable('connected_account');
        if (connectedAccountTableExists) {
            await queryRunner.dropTable('connected_account');
        }
        // Create Address table
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'address',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'label',
                    type: 'varchar',
                },
                {
                    name: 'street',
                    type: 'varchar',
                },
                {
                    name: 'city',
                    type: 'varchar',
                },
                {
                    name: 'state',
                    type: 'varchar',
                },
                {
                    name: 'zipCode',
                    type: 'varchar',
                },
                {
                    name: 'isDefault',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'userId',
                    type: 'int',
                },
            ],
        }), true);
        // Create ConnectedAccount table
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'connected_account',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'provider',
                    type: 'varchar',
                },
                {
                    name: 'email',
                    type: 'varchar',
                },
                {
                    name: 'connectedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'providerData',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'userId',
                    type: 'int',
                },
            ],
        }), true);
        // Add foreign key for Address
        await queryRunner.createForeignKey('address', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
        }));
        // Add foreign key for ConnectedAccount
        await queryRunner.createForeignKey('connected_account', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        // Drop foreign keys first
        const addressTable = await queryRunner.getTable('address');
        if (!addressTable) {
            throw new Error('Address table not found');
        }
        const addressForeignKey = addressTable.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
        if (!addressForeignKey) {
            throw new Error('Address foreign key not found');
        }
        await queryRunner.dropForeignKey('address', addressForeignKey);
        const connectedAccountTable = await queryRunner.getTable('connected_account');
        if (!connectedAccountTable) {
            throw new Error('Connected account table not found');
        }
        const connectedAccountForeignKey = connectedAccountTable.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
        if (!connectedAccountForeignKey) {
            throw new Error('Connected account foreign key not found');
        }
        await queryRunner.dropForeignKey('connected_account', connectedAccountForeignKey);
        // Then drop tables
        await queryRunner.dropTable('address');
        await queryRunner.dropTable('connected_account');
    }
}
exports.CreateAddressAndConnectedAccount1683234567890 = CreateAddressAndConnectedAccount1683234567890;
//# sourceMappingURL=1683234567890-CreateAddressAndConnectedAccount.js.map