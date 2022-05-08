import {
  ApplicationCommand,
  ApplicationCommandManager,
  ApplicationCommandPermissions,
  Collection,
  Guild,
  GuildApplicationCommandManager,
  Interaction,
  Snowflake
} from 'discord.js'
import NodeEmitter from '../../utils/NodeEmitter'
import { ProviderEntity } from '../../entities/Provider'
import EntityFile from '../../utils/EntityFile'
import BaseCommandManager from '../BaseCommandManager'
import { catchPromise, isEquivalent } from '../../utils'
import { ContextMenuEntity } from '../../entities/ContextMenu'
import Logger from '@leadcodedev/logger'

export default class SlashCommandManager {
  constructor (public commandManager: BaseCommandManager) {
  }

  public serialize (command: ApplicationCommand) {
    return {
      name: command.name,
      type: command.type,
    }
  }

  public async register (): Promise<void> {
    const files = this.commandManager.factory.ignitor.files.filter((file: { type: string }) => file.type === 'context-menu')

    await Promise.all(
      files.map(async (item) => {
        const instance = new item.default()
        const entityFile = new EntityFile(item.file.path)

        const command = new ContextMenuEntity(
          undefined,
          instance.scope,
          instance.cooldown,
          instance.ctx,
          instance.run,
          entityFile
        )

        this.commandManager.factory.ignitor.container.contextMenu.push(command)

        this.commandManager.factory.ignitor.container.providers.forEach((provider: ProviderEntity) => {
          provider.load(command)
        })
      })
    )

    await this.preTreatment()
  }

  /**
   * Delete|Edit|Create
   * @param manager
   * @param commands
   * @param commandEntities
   * @protected
   */
  protected treatment (manager: ApplicationCommandManager | GuildApplicationCommandManager, commands: Collection<Snowflake, ApplicationCommand>, commandEntities: ContextMenuEntity[]): void {
    if (commands.size === 0 && commandEntities.length === 0) {
      return
    }

    /**
     * Delete/Edit
     */
    commands.forEach((command: ApplicationCommand) => {
      const filter = (commandEntity: ContextMenuEntity) => command.name === commandEntity.ctx.name
      const commandEntity = commandEntities.find(filter)

      if (!commandEntity) {
        command.delete().catch(catchPromise)
        return
      }

      const commandEntityIndex = commandEntities.findIndex(filter)
      if (commandEntityIndex !== undefined) {
        commandEntities.splice(commandEntityIndex, 1)
      }

      if (!isEquivalent(this.serialize(commandEntity.ctx as any), this.serialize(command))) {
        manager
          .edit(command.id, {
            ...commandEntity.ctx,
          })
          .catch(catchPromise)
      }

      const definePermission = () => {
        const permissions = {
          command: command.id,
        }
        manager
          .edit(command.id, commandEntity.ctx)
          .catch(catchPromise)
      }
    })

    /**
     * Create
     */
    commandEntities.forEach((commandEntity: ContextMenuEntity) => {
      if (manager instanceof GuildApplicationCommandManager) {
        if (commandEntity.scope === 'GUILDS' || commandEntity.scope.includes(manager.guild.id)) {
          manager
            .create(commandEntity.ctx)
            .catch(catchPromise)
        }
      } else {
        manager
          .create(commandEntity.ctx)
          .catch(catchPromise)
      }
    })

    NodeEmitter.emit(
      'application::commands::registered',
      this.commandManager.factory.ignitor.container.commands
    )
  }

  private preTreatment (): void {
    const client = this.commandManager.factory.client
    const commandContainer = this.commandManager.factory.ignitor.container.contextMenu

    const globalCommandContainer = commandContainer.filter((command: ContextMenuEntity) => command.scope === 'GLOBAL')
    const guildCommandContainer = commandContainer.filter((command: ContextMenuEntity) => (
      command.scope === 'GUILDS' || Array.isArray(command.scope)
    ))

    client?.application?.commands
      .fetch()
      .then((commands: Collection<Snowflake, ApplicationCommand>) => {
        this.treatment(client!.application!.commands, commands.filter((command: ApplicationCommand) => command.type !== 'CHAT_INPUT'), globalCommandContainer)
      })
      .catch(catchPromise)


    client?.guilds.cache.forEach((guild: Guild) => {
      guild.commands
        .fetch()
        .then((commands: Collection<Snowflake, ApplicationCommand>) => {
          this.treatment(guild.commands, commands.filter((command: ApplicationCommand) => command.type !== 'CHAT_INPUT'), guildCommandContainer)
        })
        .catch((error) => {
          if (error.httpStatus === 403) {
            Logger.send('warn', `The guild "${guild.name}" (${guild.id}) does not accept command applications (scope : applications.commands).`)
            return
          }
          catchPromise(error)
        })
    })

    this.commandManager.factory.client?.on('interactionCreate', async (interaction: any) => {
      if (!interaction.isContextMenu()) {
        return
      }

      const command = commandContainer.find((command: ContextMenuEntity) => command.ctx.name.toLowerCase() === interaction.commandName.toLowerCase())
      if (command) {
        command.cooldown?.setInteraction(interaction)

        const canExecute = command.cooldown
          ? await command.cooldown?.verify()
          : true

        if (canExecute) {
          await command.run(interaction)
        }
      }
    })
  }
}