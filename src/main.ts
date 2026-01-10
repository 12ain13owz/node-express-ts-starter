import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'

import { getEnv } from './config'
import { errorHandler } from './middlewares/error-response.middleware'
import { limiter } from './middlewares/rate-limit.middleware'
import { mainRoutes } from './routes'
import { helmetOptions } from './utils/response.utils'
import { startServer } from './utils/server.utils'

const env = getEnv()
const app = express()
const port = env.PORT

app.use(cors())
app.use(helmet(helmetOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use(limiter)

app.use('/docs', express.static(path.join(__dirname, '../docs')))
app.use(mainRoutes)
app.use(errorHandler)

startServer(app, port)
