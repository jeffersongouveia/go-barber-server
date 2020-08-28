import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export default class AlterAppointmentsProvider1598622447954 implements MigrationInterface {
  private tableName = 'appointments'
  private columnName = 'provider_id'
  private foreignKeyName = `${this.tableName}_users_id_fk`

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, 'provider')
    await queryRunner.addColumn(this.tableName, new TableColumn({
      name: this.columnName,
      type: 'uuid',
      isNullable: true,
    }))
    await queryRunner.createForeignKey(this.tableName, new TableForeignKey({
      name: this.foreignKeyName,
      columnNames: [this.columnName],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, this.foreignKeyName)
    await queryRunner.dropColumn(this.tableName, this.columnName)
    await queryRunner.addColumn(this.tableName, new TableColumn({
      name: 'provider',
      type: 'varchar',
    }))
  }

}
