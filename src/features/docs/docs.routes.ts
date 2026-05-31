import { Router } from 'express'
import path from 'node:path'

const router = Router()

router.get('/', (_req, res) => {
  const htmlPath = path.resolve(__dirname, '../../../docs/index.html')
  res.sendFile(htmlPath)
})

export const docsRouter = router
