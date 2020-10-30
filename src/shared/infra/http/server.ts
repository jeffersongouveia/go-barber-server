import 'express-async-errors'
import 'reflect-metadata'
import 'dotenv/config'

import express, { Request, Response, NextFunction } from 'express'
import { errors } from 'celebrate'

import cors from 'cors'

import routes from './routes'
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter'

import '@shared/infra/database'
import '@shared/container'

import AppError from '@shared/errors/AppError'
import avatarConfig from '@config/upload'

const app = express()

app.use(cors())
app.use(express.json())
app.use(rateLimiter)
app.use(routes)
app.use(errors())
app.use('/files', express.static(avatarConfig.tempFolder))

app.use((error: Error | AppError, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(3333, () => {
  console.log('🚀 Server launched')
})
