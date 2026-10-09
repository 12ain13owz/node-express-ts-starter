import { randomUUID } from 'node:crypto'
import type { Todo } from './todo.entity'
import type { TodoRepository } from './todo.repository'

/** In-memory adapter: no persistence, state lives as long as the process (or the test). */
export const createMemoryTodoRepository = (seed: Todo[] = []): TodoRepository => {
  const store = new Map(seed.map((todo) => [todo.id, todo]))

  return {
    findAll: async () => [...store.values()],
    findById: async (id) => store.get(id) ?? null,
    findByTitle: async (title) => [...store.values()].find((todo) => todo.title === title) ?? null,
    create: async ({ title }) => {
      const todo: Todo = { id: randomUUID(), title, done: false, createdAt: new Date() }
      store.set(todo.id, todo)
      return todo
    },
    update: async (id, changes) => {
      const current = store.get(id)
      if (!current) {
        return null
      }

      const updated: Todo = { ...current, ...changes }
      store.set(id, updated)
      return updated
    },
    delete: async (id) => store.delete(id),
  }
}
