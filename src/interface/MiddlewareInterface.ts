import MiddlewareEntity from '../entities/MiddlewareEntity'
import MiddlewareContext from '../contexts/MiddlewareContext'

export interface MiddlewareInterface extends MiddlewareEntity {
  name: string
  pattern: RegExp
  path: string

  run (context: MiddlewareContext): Promise<boolean>
}

export interface BaseMiddleware {
  run (context: MiddlewareContext): Promise<boolean>
}