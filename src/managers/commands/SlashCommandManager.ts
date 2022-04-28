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
      options: command.options.map(value => this.serializeOptions(value)),
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
        ? options.options.map(value => this.serializeOptions(value))
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
    this.commandManager.factory.client?.on('interactionCreate', async (command) => {
      if (command.isCommand()) {
        const commandEntity = this.commandManager.factory.ignitor.container.commands.find((commandEntity) => command.commandName === commandEntity.ctx.name)
        await commandEntity?.run(command)
      }
    })
    const commands = this.commandManager.factory.ignitor.container.commands.map((item) => {
      return item.ctx
    })
    this.commandManager.factory.client?.on('guildCreate', async (guild: Guild) => {
      await guild.commands.set(commands)
    })
  }





}
