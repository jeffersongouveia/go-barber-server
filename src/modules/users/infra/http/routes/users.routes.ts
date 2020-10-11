import { Router } from 'express'
import multer from 'multer'

import avatarConfig from '@config/avatar'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

import UsersController from '@modules/users/infra/http/controllers/UsersController'
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController'

const usersRouter = Router()
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()
const upload = multer(avatarConfig)

usersRouter.post('/', usersController.create)
usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.update)

export default usersRouter

