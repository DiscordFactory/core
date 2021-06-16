import { PermissionResolvable } from 'discord.js'
import CommandEntity from '../entities/CommandEntity'
import Factory from '../Factory'
import { MiddlewareInterface } from '../interface/MiddlewareInterface'

type CommandContext = {
  label: string
  description: string
  tag: string
  usages?: Array<string>
  alias?: Array<string>
  roles?: Array<string>
  permissions?: Array<PermissionResolvable>
  middlewares?: Array<string>
}

export default function Command (context: CommandContext) {
  return (target: Function) => {
    return class Command extends CommandEntity {
      constructor () {
        const middlewares = context.middlewares?.map((name) => {
          const middleware = Factory.getInstance().$container?.middlewares.find((middleware) => {
            return middleware.pattern.test(name) && middleware
          })

          if (!middleware) {
            throw new Error(`Middleware "${name}" does not exist, please ensure that it does.`)
          }

          return {
            name,
            pointer: middleware as unknown as MiddlewareInterface,
          }
        })

        super(
          context.label,
          context.description,
          context.tag,
          context.usages || [],
          context.alias || [],
          context.roles || [],
          context.permissions || [],
          middlewares,
          target.prototype.run,
          undefined,
        )
      }
    }
  }
}