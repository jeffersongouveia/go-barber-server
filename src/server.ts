import express from 'express'
import routes from './routes'

import 'reflect-metadata'
import './database'

import avatarConfig from './config/avatar'

const app = express()

app.use(express.json())
app.use(routes)
app.use('/files', express.static(avatarConfig.directory))

app.listen(3333, () => {
  console.log('🚀 Server launched')
})
