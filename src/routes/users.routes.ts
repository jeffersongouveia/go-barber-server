import { Router } from 'express'
import multer from 'multer'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import avatarConfig from '../config/avatar'
import CreateUserService from '../services/CreateUserService'
import UpdateAvatarUserService from '../services/UpdateAvatarUserService'

const usersRouter = Router()
const upload = multer(avatarConfig)

usersRouter.post('/', async (request, response) => {
  const createUser = new CreateUserService()
  const user = await createUser.execute(request.body)

  // @ts-ignore
  delete user.password

  return response.json(user)
})

// @ts-ignore
usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
  const updateUserAvatar = new UpdateAvatarUserService()
  const user = await updateUserAvatar.execute({
    idUser: request.user.id,
    fileName: request.file.filename,
  })

  // @ts-ignore
  delete user.password

  return response.json(user)
})

export default usersRouter

