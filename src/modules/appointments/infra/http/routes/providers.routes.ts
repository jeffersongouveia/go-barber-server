import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController'
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController'
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController'

const providersRouter = Router()
const providersController = new ProvidersController()
const providerDayController = new ProviderDayAvailabilityController()
const providerMonthController = new ProviderMonthAvailabilityController()

providersRouter.use(ensureAuthenticated)
providersRouter.get('/', providersController.index)

providersRouter.get(
  '/availability-day/:provider_id',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayController.index,
)
providersRouter.get(
  '/availability-month/:provider_id',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthController.index,
)

export default providersRouter
