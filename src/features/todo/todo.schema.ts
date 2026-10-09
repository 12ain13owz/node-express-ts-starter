import { z } from 'zod'
import { ERRORS } from '@/shared/constants'

const createBody = z.object({
  title: z
    .string({ error: ERRORS.UTIL.requiredField('Title') })
    .trim()
    .min(1, ERRORS.UTIL.requiredField('Title')),
})

const idParams = z.object({
  id: z.uuid({ error: ERRORS.UTIL.invalidField('todo id') }),
})

export const todoSchema = {
  create: { body: createBody },
  byId: { params: idParams },
} as const

export type CreateTodoInput = z.infer<typeof createBody>
export type TodoIdParams = z.infer<typeof idParams>
