import Constructable from '../Constructable'

export type MiddlewareContext = {
  pattern: string
}

export type Middleware = {
  name: string
  pointer: Constructable<any>
}