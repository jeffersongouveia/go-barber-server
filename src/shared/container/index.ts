import { container } from 'tsyringe'

import AppointmentsRepository from '@modules/appointments/infra/database/repositories/AppointmentsRepository'
import UsersRepositories from '@modules/users/infra/database/repositories/UsersRepositories'
import HairStylistRepository from '@modules/users/infra/database/repositories/HairStylistRepository'
import UserTokenRepository from '@modules/users/infra/database/repositories/UserTokenRepository'
import NotificationsRepository from '@modules/notifications/infra/database/repositories/NotificationsRepository'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHairStylistRepository from '@modules/users/repositories/IHairStylistRepository'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

import '@modules/users/providers'
import '@shared/container/providers'

container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository)
container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepositories)
container.registerSingleton<IHairStylistRepository>('HairStylistRepository', HairStylistRepository)
container.registerSingleton<IUserTokenRepository>('UserTokenRepository', UserTokenRepository)
container.registerSingleton<INotificationsRepository>('NotificationsRepository', NotificationsRepository)
