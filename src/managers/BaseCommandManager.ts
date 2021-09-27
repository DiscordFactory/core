import SlashCommandManager from './commands/SlashCommandManager'
import ContextMenuCommandManager from './commands/ContextMenuCommandManager'
import Factory from '../Factory'
import { ApplicationCommand, ApplicationCommandData, Snowflake } from 'discord.js'
import { CommandEntity } from '../entities/Command'
import Logger from '@leadcodedev/logger'

export default class BaseCommandManager {
  public readonly commandManager: SlashCommandManager = new SlashCommandManager(this)
  public readonly contextMenuManager: ContextMenuCommandManager = new ContextMenuCommandManager(this)

  constructor (public factory: Factory) {
  }

  public async setup () {
    await Promise.all([
      this.commandManager.register(),
      this.contextMenuManager.register()
    ])
  }

  public add (guildId: Snowflake) {
    const guild = this.factory.client?.guilds.cache.get(guildId)
    this.factory.ignitor.container.commands.forEach((command: CommandEntity) => {
      guild?.commands
        .create(command as unknown as ApplicationCommandData)
        .catch((error) => {
          Logger.send('error', error.message)
          process.exit(1)
        })
    })
  }

  public remove (guildId: Snowflake) {
    const guild = this.factory.client?.guilds.cache.get(guildId)
    guild?.commands.cache.forEach((command: ApplicationCommand) => {
      command.delete().catch((error) => {
        Logger.send('error', error.message)
        process.exit(1)
      })
    })
  }
}