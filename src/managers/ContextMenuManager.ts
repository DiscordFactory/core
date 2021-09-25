import Factory from '../Factory'
import { ApplicationCommand, ApplicationCommandData, Collection, Guild, Interaction } from 'discord.js'
import NodeEmitter from '../utils/NodeEmitter'
import { ProviderEntity } from '../entities/Provider'
import EntityFile from '../utils/EntityFile'
import { ContextMenuEntity } from '../entities/ContextMenu'

export default class ContextMenuManager {
  constructor (public factory: Factory) {
  }

  public async register (): Promise<void> {
    const container = this.factory.ignitor.container.contextMenu
    const files = this.factory.ignitor.files.filter((file: { type: string }) => file.type === 'context-menu')

    await Promise.all(
      files.map(async (item) => {
        const instance = new item.default()
        const entityFile = new EntityFile(item.file.path)

        const contextMenu = new ContextMenuEntity(
          undefined,
          instance.scope,
          instance.roles,
          instance.cooldown,
          instance.ctx,
          instance.run,
          entityFile
        )

        container.push(contextMenu)

        this.factory.ignitor.container.providers.forEach((provider: ProviderEntity) => {
          provider.load(contextMenu)
        })
      })
    )

    await this.insertCommands()
  }

  public async insertCommands (): Promise<void> {
    const contextMenu = this.factory.ignitor.container.contextMenu

    const globalCommands = contextMenu
      .map((command: ContextMenuEntity) => command.scope === 'GLOBAL' && {
        ...command.context,
        permissions: command.roles.map((role: string) => ({ id: role, type: 'ROLE', permission: true })),
      })
      .filter(a => a)

    await this.factory.client?.application?.commands.set(globalCommands as unknown as ApplicationCommandData[])

    const guildCommandEntities = contextMenu
      .map((command: ContextMenuEntity) => command.scope !== 'GLOBAL' && command)
      .filter(a => a) as ContextMenuEntity[]

    const collection = new Collection<string, ContextMenuEntity[]>()
    guildCommandEntities.forEach((command: ContextMenuEntity) => {
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

    collection.map(async (commands: ContextMenuEntity[], key: string) => {
      const guild: Guild | undefined = this.factory.client!.guilds.cache.get(key)

      const cacheCommands = await guild?.commands.set(commands.map((command: ContextMenuEntity) => ({
        ...command.ctx,
        ...command.roles.length && { defaultPermission: false },
      })))

      await guild?.commands.permissions.set({
        fullPermissions: await Promise.all(commands.map(async (command: ContextMenuEntity) => {
          const registeredCommand: ApplicationCommand | undefined = cacheCommands?.find((applicationCommand: ApplicationCommand) => (
            applicationCommand.name === command.ctx.name
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

      NodeEmitter.emit(
        'application::commands::registered',
        this.factory.ignitor.container.commands
      )

      commands.forEach((command: ContextMenuEntity) => {
        this.factory.client?.on('interactionCreate', async (interaction: Interaction) => {
          if (!interaction.isContextMenu()) {
            return
          }

          if (interaction.commandName.toLowerCase() === command.ctx.name.toLowerCase()) {
            command.cooldown?.setInteraction(interaction)

            if (command.cooldown) {
              const canExecute = await command.cooldown?.verify()
              if (!canExecute) {
                return
              }
            }
            await command.run(interaction)
          }
        })
      })
    })
  }
}