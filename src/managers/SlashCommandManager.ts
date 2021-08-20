import { ApplicationCommand, ApplicationCommandData, Collection, Interaction } from 'discord.js'
import Factory from '../Factory'
import { QueueItem } from '../types'
import { activeProvider } from '../helpers/Provider'
import SlashCommandEntity from '../entities/SlashCommandEntity'
import { SlashOption } from '../types/SlashCommand'
import Manager from './Manager'

export default class SlashCommandManager extends Manager {
  public async register (item: QueueItem) {
    const $container = Factory.getInstance().$container

    const instance = new item.default()
    const slashCommand = new SlashCommandEntity(instance.scope, instance.roles, instance.context, instance.run, item.file)

    $container?.slashCommands.push(slashCommand)

    await this.activeProvider(slashCommand)
  }

  public async activeProvider (slashCommandEntity: SlashCommandEntity) {
    await activeProvider(
      Factory.getInstance().$container!,
      slashCommandEntity,
    )
  }
  
  public async registerSlashInstance () {
    const container = Factory.getInstance().$container
    
    const globalCommands = container?.slashCommands
      .map((command: SlashCommandEntity) => command.scope === 'GLOBAL' && {
        ...command.context,
        permissions: command.roles.map((role: string) => ({ id: role, type: 'ROLE', permission: true })),
      })
      .filter(a => a) as SlashOption[]

    await container!.client.application?.commands.set(globalCommands as unknown as ApplicationCommandData[])

    const guildCommandEntities = container?.slashCommands
      .map((command: SlashCommandEntity) => command.scope !== 'GLOBAL' && command)
      .filter(a => a) as SlashCommandEntity[]

    const collection = new Collection<string, SlashCommandEntity[]>()
    guildCommandEntities.forEach((command) => {
      const scopes = command.scope as string[]
      scopes.forEach((scope: string) => {
        const guild = collection.get(scope)
        if (!guild) {
          collection.set(scope, [command])
          return
        }
        guild?.push(command)
      })
    })

    collection.map(async (commands: SlashCommandEntity[], key: string) => {
      const guild = container?.client.guilds.cache.get(key)

      const cacheCommands = await guild?.commands.set(commands.map((command: SlashCommandEntity) => ({
        ...command.context,
        ...command.roles.length && { defaultPermission: false },
      })))

      await guild?.commands.permissions.set({
        fullPermissions: await Promise.all(commands.map(async (command: SlashCommandEntity) => {
          const registeredCommand: ApplicationCommand | undefined = cacheCommands?.find((applicationCommand: ApplicationCommand) => (
            applicationCommand.name === command.context.name
          ))

          return {
            id: registeredCommand!.id,
            permissions: command.roles.map((role: string) => ({
              id: role,
              type: 'ROLE' as any,
              permission: true,
            })),
          }
        })),
      })
    })
  }

  public async initializeSlashCommands () {
    const container = Factory.getInstance().$container

    container?.client.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isCommand()) {
        return
      }

      const command = container?.slashCommands.find((command: SlashCommandEntity) => (
        command.context.name === interaction.commandName.toLowerCase()
      ))

      if (!command) {
        return
      }

      await command.run(interaction)
    })
  }
}