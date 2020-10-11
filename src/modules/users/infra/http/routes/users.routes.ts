import { Router } from 'express'
import { container } from 'tsyringe'
import multer from 'multer'

import avatarConfig from '@config/avatar'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

import CreateUserService from '@modules/users/services/CreateUserService'
import UpdateAvatarUserService from '@modules/users/services/UpdateAvatarUserService'

const usersRouter = Router()
const upload = multer(avatarConfig)

usersRouter.post('/', async (request, response) => {
  const createUser = container.resolve(CreateUserService)
  const user = await createUser.execute(request.body)

  // @ts-ignore
  delete user.password

  return response.json(user)
})

// @ts-ignore
usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
  const updateUserAvatar = container.resolve(UpdateAvatarUserService)
  const user = await updateUserAvatar.execute({
    idUser: request.user.id,
    fileName: request.file.filename,
  })

  // @ts-ignore
  delete user.password

  return response.json(user)
})

export default usersRouter

