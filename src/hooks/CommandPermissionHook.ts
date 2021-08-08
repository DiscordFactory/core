import { GuildMember, PermissionResolvable } from 'discord.js'
import CommandContext from '../contexts/CommandContext'
import Hook from '../decorators/Hook'
import { BaseHook } from '../interface/HookInterface'
import Application from '../Application'

@Hook('app:command:preload')
export default class CommandPermissionHook implements BaseHook {
  public async run (context: CommandContext): Promise<any> {
    const { sender, command, message } = context
    if (command.permissions?.length) {
      const hasPermissions = (sender: GuildMember | null, permissions: Array<PermissionResolvable>) => {
        if (!sender) {
          return false
        }

        return permissions.some((permission: PermissionResolvable) => {
          return sender.permissions.has(permission)
        })
      }

      if (!hasPermissions(sender, command.permissions)) {
        context.setCancelled(true)

        const messages = Application.getEnvironment('MESSAGES')
        return await message.reply(
          messages.COMMAND_MISSING_PERMISSION
          || 'You are not allowed to execute this command.')
      }
    }
  }
}