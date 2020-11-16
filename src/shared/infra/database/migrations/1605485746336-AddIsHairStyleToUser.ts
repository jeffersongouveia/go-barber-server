import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddIsHairStyleToUser1605485746336 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'is_hairstyle',
        type: 'boolean',
        default: false,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'is_hairstyle')
  }

}
