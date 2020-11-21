import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('hairstylists')
class HairStylist {
  @PrimaryGeneratedColumn(`uuid`)
  id: string

  @Column()
  user_id: string

  @Column()
  hour_start: string

  @Column()
  hour_stop: string

  @Column()
  works_sunday: boolean

  @Column()
  works_monday: boolean

  @Column()
  works_tuesday: boolean

  @Column()
  works_wednesday: boolean

  @Column()
  works_thursday: boolean

  @Column()
  works_friday: boolean

  @Column()
  works_saturday: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

export default HairStylist
