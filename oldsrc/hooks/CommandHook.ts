import Hook from '../decorators/Hook'
import { BaseHook } from '../types/Hook'
import CommandContext from '../contexts/CommandContext'
import MiddlewareContext from '../contexts/MiddlewareContext'

@Hook('app:command:preload')
export default class CommandHook implements BaseHook {
  public async run (context: CommandContext): Promise<void> {
    const { sender, args, command, message } = context

    for (const { name, pointer } of command?.middlewares) {
      const middleware = new MiddlewareContext(name, sender, args, message, command, pointer)
      const execute = await pointer.run(middleware)

      if (!execute) {
        return context.setCancelled(true)
      }
    }
  }
}