import { PermissionResolvable } from 'discord.js'
import CommandEntity from '../entities/CommandEntity'
import { CommandInterface } from '../interface/CommandInterface'

export default function Command(context: CommandInterface) {
  return (target: Function) => {
    return class Command extends CommandEntity {
      constructor() {
        // const reqs = (require || []).map((name: string) => {
        //   const req = Array.from(Manager.requires.values()).find((instance) => instance.pattern.test(name))
        //
        //   if (!req) {
        //     Logger.send('error', `Prerequisite ${name} does not exist, please ensure that it does`)
        //   }
        //
        //   return {
        //     name,
        //     pointer: req!
        //   }
        // })
        super(
          context.label,
          context.description,
          context.tag,
          context.usages || [],
          context.alias || [],
          context.roles || [],
          context.permissions || [],
          [],
          target.prototype.run)
      }
    }
  }
}