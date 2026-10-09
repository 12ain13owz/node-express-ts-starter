import type { NewTodo, Todo, TodoChanges } from './todo.entity'

/**
 * Port: what the service needs from storage. Implementations live in
 * `todo.repository.<driver>.ts` and are picked in `index.ts`.
 * Lookups return `null` when nothing matches; writes on a missing id throw `NotFoundError`.
 */
export interface TodoRepository {
  findAll(): Promise<Todo[]>
  findById(id: string): Promise<Todo | null>
  findByTitle(title: string): Promise<Todo | null>
  create(data: NewTodo): Promise<Todo>
  update(id: string, changes: TodoChanges): Promise<Todo>
  delete(id: string): Promise<void>
}
