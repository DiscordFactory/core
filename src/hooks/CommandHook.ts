import Hook from '../decorators/Hook'
import BaseHook from '../interface/HookInterface'
import CommandContext from '../contexts/CommandContext'
import MiddlewareContext from '../contexts/MiddlewareContext'
import { MiddlewareInterface } from '../interface/MiddlewareInterface'
import Constructable from '../Constructable'

type Middleware = {
  name: string
  pointer: Constructable<any>
}

@Hook('app:command:preload')
export default class CommandHook implements BaseHook {
  public async run(context: CommandContext): Promise<void> {
    const { sender, args, command, message } = context

    for (const { name, pointer } of command?.middlewares as unknown as Array<Middleware>) {
      console.log(name, sender, args, message, command, pointer)
      const middleware = new MiddlewareContext(name, sender, args, message, command, pointer)
      const execute = await (pointer.instance as any).run(middleware)

      if (!execute) {
        return context.setCancelled(true)
      }
    }
  }
}