import Constructable from '../Constructable'

export type MiddlewareContext = {
  pattern: string
}

export type Middleware = {
  name: string
  pointer: Constructable<any>
}

export interface MiddlewareInterface {
  name: string
  pattern: RegExp
  path: string

  run (context: MiddlewareContext): Promise<boolean>
}

export interface BaseMiddleware {
  run (context: MiddlewareContext): Promise<boolean>
}