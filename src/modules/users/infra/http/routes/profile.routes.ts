import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import ProfileController from '@modules/users/infra/http/controllers/ProfileController'
import HairStylistController from '@modules/users/infra/http/controllers/HairStylistController'

const profileRouter = Router()
const profileController = new ProfileController()
const hairStylistController = new HairStylistController()

profileRouter.use(ensureAuthenticated)

profileRouter.get('/', profileController.show)

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      is_hairstylist: Joi.boolean(),
      current_password: Joi.string(),
      new_password: Joi.string(),
      new_password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
)

profileRouter.get('/hairstylist', hairStylistController.index)

profileRouter.post(
  '/hairstylist',
  celebrate({
    [Segments.BODY]: {
      hour_start: Joi.string().required(),
      hour_stop: Joi.string().required(),
      days_available: Joi.array().min(1).max(7).required(),
    },
  }),
  hairStylistController.update,
)

export default profileRouter

