import SlashCommandManager from './commands/SlashCommandManager'
import ContextMenuCommandManager from './commands/ContextMenuCommandManager'
import Factory from '../Factory'
import { Guild } from 'discord.js'
import { CommandEntity } from '../entities/Command'
import Logger from '@leadcodedev/logger'
import { ContextMenuEntity } from '../entities/ContextMenu'
import { catchPromise } from '../utils'

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

  public async add (guild: Guild) {
    try {
      await guild.commands.fetch()
    } catch (error: any) {
      if (error.httpStatus === 403) {
        Logger.send('warn', `The guild "${guild.name}" (${guild.id}) does not accept command applications (scope : applications.commands).`)
        return
      }
      catchPromise(error)
    }

    const container = this.factory.ignitor.container
    const commands = [
      ...container.commands,
      ...container.contextMenu,
    ]

    const guildCommandsFilter = (command: CommandEntity | ContextMenuEntity) => command.scope === 'GUILDS' || (Array.isArray(command.scope) && command.scope.includes(guild.id))
    commands
      .filter(guildCommandsFilter)
      .forEach((command: CommandEntity | ContextMenuEntity ) => {
        guild.commands
          .create(command.ctx)
          .catch(catchPromise)
      })
  }
}