import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { env } from '@/core/config'
import { errorHandler } from '@/core/error'
import { limiter } from '@/core/middleware'
import { startServer } from '@/core/server'
import { mainRoutes } from '@/routes'

import { HELMET_OPTIONS } from './shared/constants'

const app = express()
const port = env.PORT

app.use(cors())
app.use(helmet(HELMET_OPTIONS))
app.use(morgan('dev'))
app.use(express.json())
app.use(limiter)

app.use(mainRoutes)
app.use(errorHandler)

startServer(app, port)
