import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import 'reflect-metadata'

import routes from './routes'

import '@shared/infra/database'

import AppError from '@shared/errors/AppError'
import avatarConfig from '@config/avatar'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/files', express.static(avatarConfig.directory))

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
