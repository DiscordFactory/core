import { GuildMember } from 'discord.js'
import Hook from '../decorators/Hook'
import { BaseHook } from '../interface/HookInterface'
import CommandContext from '../contexts/CommandContext'
import Environment from '../Environment'

@Hook('app:command:preload')
export default class CommandRoleHook implements BaseHook {
  public async run(context: CommandContext): Promise<any> {
    const { sender, command, message } = context
    if (command.roles?.length) {
      const hasRole = (sender: GuildMember | null, roles: Array<string>) => {
        if (!sender) {
          return false
        }
        return roles.some((role: string) => {
          return sender.roles.cache.has(role)
        })
      }

      if (!hasRole(sender, command.roles)) {
        context.setCancelled(true)
        const messages = Environment.get('MESSAGES')
        return await message.reply(messages.COMMAND_MISSING_ROLES || 'You are not allowed to execute this command.')
      }
    }
  }
}