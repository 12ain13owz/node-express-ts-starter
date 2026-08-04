import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import { corsOptions, env, helmetOptions, rateLimitOptions } from '@/core/config'
import { errorHandler } from '@/core/error'
import { startServer } from '@/core/server'
import { mainRoutes } from '@/routes'

const app = express()
const port = env.PORT

app.use(cors(corsOptions))
app.use(helmet(helmetOptions))
app.use(rateLimit(rateLimitOptions))
app.use(morgan('dev'))
app.use(express.json())

app.use(mainRoutes)
app.use(errorHandler)

startServer(app, port)
