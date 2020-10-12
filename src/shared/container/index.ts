import { container } from 'tsyringe'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

import AppointmentsRepository from '@modules/appointments/infra/database/repositories/AppointmentsRepository'
import UsersRepositories from '@modules/users/infra/database/repositories/UsersRepositories'

import '@modules/users/providers'

container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository)
container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepositories)
