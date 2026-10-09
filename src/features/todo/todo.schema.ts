import { z } from 'zod'
import { ERRORS } from '@/shared/constants'

const createBody = z.object({
  title: z
    .string({ error: ERRORS.requiredField('Title') })
    .trim()
    .min(1, ERRORS.requiredField('Title')),
})

const idParams = z.object({
  id: z.uuid({ error: ERRORS.invalidField('todo id') }),
})

export const todoSchema = {
  create: { body: createBody },
  byId: { params: idParams },
} as const

export type CreateTodoInput = z.infer<typeof createBody>
export type TodoIdParams = z.infer<typeof idParams>
