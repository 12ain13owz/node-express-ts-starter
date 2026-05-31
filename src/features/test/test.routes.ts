import { Router } from 'express'

import type { NextFunction, Request, Response } from 'express'

const router = Router()

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.json({ message: 'Hello World!' })
})

export const testRouter = router
