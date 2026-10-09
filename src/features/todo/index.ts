import { createTodoController } from './todo.controller'
import { createMemoryTodoRepository } from './todo.repository.memory'
import { createTodoRouter } from './todo.routes'
import { createTodoService } from './todo.service'

// Composition root: the only place that picks the storage adapter.
// Swap to a DB without touching service/controller, e.g.
// const todoRepo = createPrismaTodoRepository(prisma)
const todoRepo = createMemoryTodoRepository()
const todoService = createTodoService({ todoRepo })

export const todoRouter = createTodoRouter(createTodoController(todoService))

export type { Todo } from './todo.entity'
