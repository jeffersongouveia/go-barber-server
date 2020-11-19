import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateHairStylists1605743954959 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'hairstylists',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'user_id',
          type: 'uuid',
        },
        {
          name: 'hour_start',
          type: 'time',
        },
        {
          name: 'hour_stop',
          type: 'time',
        },
        {
          name: 'works_sunday',
          type: 'boolean',
        },
        {
          name: 'works_monday',
          type: 'boolean',
        },
        {
          name: 'works_tuesday',
          type: 'boolean',
        },
        {
          name: 'works_wednesday',
          type: 'boolean',
        },
        {
          name: 'works_thursday',
          type: 'boolean',
        },
        {
          name: 'works_friday',
          type: 'boolean',
        },
        {
          name: 'works_saturday',
          type: 'boolean',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
      foreignKeys: [
        {
          name: 'UserHairStylist',
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          columnNames: ['user_id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      ],
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('hairstylists')
  }

}
