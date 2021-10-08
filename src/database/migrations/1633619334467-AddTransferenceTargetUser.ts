import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";

export class AddTransferenceTargetUser1633619334467 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: 'transfers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'sender_id',
            type: 'uuid',
          },
          {
            name: 'target_id',
            type: 'uuid',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ],
        foreignKeys: [
          {
            name: 'FK_sender_id',
            columnNames: ['sender_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          {
            name: 'FK_target_id',
            columnNames: ['target_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          }
        ]
      }));
      await queryRunner.changeColumn("statements", "type", new TableColumn({
        name: "type",
        type: "enum",
        enum: ['deposit', 'withdraw', 'transfer']
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("transfers");
      await queryRunner.query("DELETE FROM statements WHERE statements.type='transfer'");
      await queryRunner.changeColumn("statements", "type", new TableColumn({
        name: "type",
        type: "enum",
        enum: ['deposit', 'withdraw']
      }));
    }

}
