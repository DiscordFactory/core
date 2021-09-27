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
import { CommandEntity } from '../../entities/Command'
import NodeEmitter from '../../utils/NodeEmitter'
import { ProviderEntity } from '../../entities/Provider'
import EntityFile from '../../utils/EntityFile'
import BaseCommandManager from '../BaseCommandManager'
import { catchPromise, isEquivalent } from '../../utils'
import Logger from '@leadcodedev/logger'

export default class SlashCommandManager {
  constructor (public commandManager: BaseCommandManager) {
  }

  public serialize (command: ApplicationCommand) {
    return {
      name: command.name,
      description: command.description,
      options: command.options.map(this.serializeOptions),
    }
  }

  public serializeOptions (options: any) {
    return {
      name: options.name,
      description: options.description,
      type: options.type,
      required: options.required !== undefined
        ? options.required
        : false,
      choices: options.choices || undefined,
      options: Array.isArray(options.options)
        ? options.options.map(this.serializeOptions)
        : undefined
    }
  }

  public async register (): Promise<void> {
    const files = this.commandManager.factory.ignitor.files.filter((file: { type: string }) => file.type === 'command')

    await Promise.all(
      files.map(async (item) => {
        const instance = new item.default()
        const entityFile = new EntityFile(item.file.path)

        const command = new CommandEntity(
          undefined,
          instance.scope,
          instance.permissions,
          instance.cooldown,
          instance.ctx,
          instance.run,
          entityFile
        )

        this.commandManager.factory.ignitor.container.commands.push(command)

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
  protected treatment (manager: ApplicationCommandManager | GuildApplicationCommandManager, commands: Collection<Snowflake, ApplicationCommand>, commandEntities: CommandEntity[]): void {
    if (commands.size === 0 && commandEntities.length === 0) {
      return
    }

    /**
     * Delete/Edit
     */
    commands.forEach((command: ApplicationCommand) => {
      const filter = (commandEntity: CommandEntity) => command.name === commandEntity.ctx.name
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
            defaultPermission: commandEntity.permissions.length === 0
          })
          .catch(catchPromise)
      }

      const definePermission = () => {
        const permissions = {
          command: command.id,
          permissions: commandEntity.permissions,
        }

        manager
          .edit(command.id, {
            ...commandEntity.ctx,
            defaultPermission: commandEntity.permissions.length === 0
          })
          .catch(catchPromise)

        if (manager instanceof GuildApplicationCommandManager) {
          manager.permissions.set(permissions).catch(catchPromise)
        } else {
          this.commandManager.factory.guildIds.forEach((guildId: Snowflake) => {
            manager.permissions.set({
              ...permissions,
              guild: guildId
            }).catch(catchPromise)
          })
        }
      }

      command.permissions
        .fetch({ command: command.id })
        .then((commandPermissions: ApplicationCommandPermissions[]) => {
          if (!isEquivalent(commandEntity.permissions, commandPermissions)) {
            definePermission()
          }
        })
        .catch((error) => {
          if (error.httpStatus === 404) {
            definePermission()
            return
          }
          catchPromise(error)
        })
    })

    /**
     * Create
     */
    commandEntities.forEach((commandEntity: CommandEntity) => {
      if (manager instanceof GuildApplicationCommandManager) {
        if (commandEntity.scope === 'GUILDS' || commandEntity.scope.includes(manager.guild.id)) {
          manager
            .create({
              ...commandEntity.ctx,
              defaultPermission: commandEntity.permissions.length === 0
            })
            .then((command: ApplicationCommand) => {
              manager.permissions.set({
                command: command.id,
                permissions: commandEntity.permissions,
              }).catch(catchPromise)
            })
            .catch(catchPromise)
        }
      } else {
        manager
          .create({
            ...commandEntity.ctx,
            defaultPermission: commandEntity.permissions.length === 0
          })
          .then((command: ApplicationCommand) => {
            this.commandManager.factory.guildIds.forEach((guildId: Snowflake) => {
              manager.permissions.set({
                command: command.id,
                permissions: commandEntity.permissions,
                guild: guildId
              }).catch(catchPromise)
            })
          })
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
    const commandContainer = this.commandManager.factory.ignitor.container.commands

    const globalCommandContainer = commandContainer.filter((command: CommandEntity) => command.scope === 'GLOBAL')
    const guildCommandContainer = commandContainer.filter((command: CommandEntity) => (
      command.scope === 'GUILDS' || Array.isArray(command.scope)
    ))

    client?.application?.commands
      .fetch()
      .then((commands: Collection<Snowflake, ApplicationCommand>) => {
        this.treatment(client!.application!.commands, commands.filter((command: ApplicationCommand) => command.type === 'CHAT_INPUT'), globalCommandContainer)
      })
      .catch(catchPromise)

    client?.guilds.cache.forEach((guild: Guild) => {
      guild.commands
        .fetch()
        .then((commands: Collection<Snowflake, ApplicationCommand>) => {
          this.treatment(guild.commands, commands.filter((command: ApplicationCommand) => command.type === 'CHAT_INPUT'), guildCommandContainer)
        })
        .catch((error) => {
          if (error.httpStatus === 403) {
            Logger.send('warn', `The guild "${guild.name}" (${guild.id}) does not accept command applications (scope : applications.commands).`)
            return
          }
          catchPromise(error)
        })
    })

    this.commandManager.factory.client?.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isCommand()) {
        return
      }

      const command = commandContainer.find((command: CommandEntity) => command.ctx.name.toLowerCase() === interaction.commandName.toLowerCase())
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