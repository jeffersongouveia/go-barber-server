import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameIsHairstyle1605744111121 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('users', 'is_hairstyle', 'is_hairstylist')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('users', 'is_hairstylist', 'is_hairstyle')
  }

}
