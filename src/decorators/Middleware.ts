import BaseMiddleware from '../entities/MiddlewareEntity'

type MiddlewareContext = {
  pattern: string
}

export default function Middleware(context: MiddlewareContext) {
  return (target: Function) => {
    return class Middleware extends BaseMiddleware {
      constructor() {
        super(context.pattern, target.prototype.run)
      }
    }
  }
}