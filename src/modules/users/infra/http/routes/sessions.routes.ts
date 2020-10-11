import { Router } from 'express'

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'
import UsersRepositories from '@modules/users/infra/database/repositories/UsersRepositories'

const sessionsRouter = Router()

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body

  const usersRepositories = new UsersRepositories()
  const authUser = new AuthenticateUserService(usersRepositories)
  const { user, token } = await authUser.execute({ email, password })

  // @ts-ignore
  delete user.password

  return response.json({ user, token })
})

export default sessionsRouter
