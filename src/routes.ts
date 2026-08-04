import { Router } from 'express'
import { docsRouter } from '@/features/docs'
import { healthRouter } from '@/features/health'
import { testRouter } from '@/features/test'

const router = Router()

router.use(testRouter)
router.use('/health', healthRouter)
router.use('/docs', docsRouter)

export const mainRoutes = router
