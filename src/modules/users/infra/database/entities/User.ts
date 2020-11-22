import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { classToClass, Exclude, Expose } from 'class-transformer'

import uploadConfig from '@config/upload'
import HairStylist from '@modules/users/infra/database/entities/HairStylist'

import IHairStylistProfile from '@modules/users/dtos/IHairStylistProfile'
import Omit = jest.Omit

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Exclude()
  @Column()
  password: string

  @Column()
  avatar: string

  @Column()
  is_hairstylist: boolean

  @Exclude()
  @OneToOne(() => HairStylist)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  hairstylist: HairStylist

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`
      case 's3':
        return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${this.avatar}`
      default:
        return null
    }
  }

  @Expose({ name: 'hairstylist_profile' })
  getHairstylistProfile(): Omit<IHairStylistProfile, 'user_id'> | undefined {
    if (!this.hairstylist) {
      return undefined
    }

    const hairstylist = classToClass(this.hairstylist)

    const profile: Omit<IHairStylistProfile, 'user_id'> = {
      hour_start: hairstylist.hour_start,
      hour_stop: hairstylist.hour_stop,
      days_available: [],
    }

    const keysWorksDays = Object.keys(hairstylist).filter((key) => key.startsWith('works_'))
    keysWorksDays.forEach((key) => {
      // @ts-ignore
      if (hairstylist[key]) {
        const dayAvailable = key.replace('works_', '')
        profile.days_available.push(dayAvailable)
      }
    })

    return profile
  }

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

export default User

