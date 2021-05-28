import { GuildMember, Message } from 'discord.js'
import Env from '@discord-factory/env'
import Factory from './Factory'
import CommandContext from './contexts/CommandContext'
import NodeEmitter from './NodeEmitter'
import Environment from './Environment'

export default class Guard {
  /**
   * Performs recurring checks before an order is executed.
   * Calls on the middleware assigned to the command used
   * to authorise or not the execution of the command.
   * @param message Message
   */
  public async protect (message: Message) {
    const sender: GuildMember | null = message.member
    const args: Array<string> = message.content.split(' ')

    /**
     * If the author of the message is a bot,
     * we stop the process
     */
    if (message.author.bot) {
      return
    }

    /**
     * We check the presence of a token within
     * the application environment else cancel process
     */
    const prefix = Environment.get('APP_PREFIX')
    const messages = Environment.get('MESSAGES')

    if (!prefix) {
      throw new Error(messages.ENVIRONMENT_FILE_PREFIX_MISSING || 'The prefix cannot be found, please define it in your environment file')
    }

    /**
     * Checks that the content of the message
     * starts with the prefix, if not, the process is stopped
     */
    if (!message.content.startsWith(prefix)) {
      /**
       * Emission of the event when
       * the message received is not a command
       */
      return await NodeEmitter.register(
        'app:message:received',
        message,
      )
    }

    /**
     * Configuration of the context to be passed
     * to the control entity
     */
    const alias: string = args[0].trim().toLowerCase().replace(prefix, '')
    const commands = Factory.getInstance().$container!.commandAlias
    const command = commands[alias]

    if (command) {
      const commandContext = new CommandContext(sender, args.slice(1), message, command)
      await NodeEmitter.register(
        'app:command:preload',
        commandContext,
      )

      /**
       * Emit cancelled command event from core
       * by middleware.
       */
      if (commandContext.isCancelled()) {
        return await NodeEmitter.register(
          'app:command:cancelled',
          commandContext,
        )
      }

      /**
       * Emit successfully running
       * command event from core.
       */
      await command.run(message, args.slice(1))
      await NodeEmitter.register(
        'app:command:executed',
        commandContext,
      )

      const presets = Environment.get('PRESETS')
      if (presets.COMMAND_AUTO_REMOVE === 'true') {
        await message.delete()
      }
    }
  }
}