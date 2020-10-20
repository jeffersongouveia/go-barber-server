import { container } from 'tsyringe'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

import AppointmentsRepository from '@modules/appointments/infra/database/repositories/AppointmentsRepository'
import UsersRepositories from '@modules/users/infra/database/repositories/UsersRepositories'
import UserTokenRepository from '@modules/users/infra/database/repositories/UserTokenRepository'

import '@modules/users/providers'
import '@shared/container/providers'

container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository)
container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepositories)
container.registerSingleton<IUserTokenRepository>('UserTokenRepository', UserTokenRepository)
