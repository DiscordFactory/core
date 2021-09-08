import Factory from '../Factory'
import { ApplicationCommand, ApplicationCommandData, Collection, Interaction } from 'discord.js'
import { CommandEntity } from '../entities/Command'

export default class CommandManager {
  constructor (public factory: Factory) {
  }

  public async register () {
    const container = this.factory.ignitor.container.commands
    const files = this.factory.ignitor.files.filter((file: any) => file.type === 'command')

    files.map(async (item) => {
      const instance = new item.default()
      const command = new CommandEntity(
        instance.scope,
        instance.roles,
        instance.context,
        instance.run,
        item.file
      )

      container.push(command)
      this.emit(command)

      this.factory.client?.on('interactionCreate', async (interaction: Interaction) => {
        if (!interaction.isCommand()) {
          return
        }

        if (interaction.commandName.toLowerCase() === command.context.name.toLowerCase()) {
          await command.run(interaction)
        }
      })
    })

    await this.insertCommands()
  }

  public async insertCommands () {
    const container = this.factory.ignitor.container

    const globalCommands = container.commands
      .map((command: CommandEntity) => command.scope === 'GLOBAL' && {
        ...command.context,
        permissions: command.roles.map((role: string) => ({ id: role, type: 'ROLE', permission: true })),
      })
      .filter(a => a)

    await this.factory.client?.application?.commands.set(globalCommands as unknown as ApplicationCommandData[])

    const guildCommandEntities = container.commands
      .map((command: CommandEntity) => command.scope !== 'GLOBAL' && command)
      .filter(a => a) as CommandEntity[]

    const collection = new Collection<string, CommandEntity[]>()
    guildCommandEntities.forEach((command: CommandEntity) => {
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

    collection.map(async (commands: CommandEntity[], key: string) => {
      const guild = this.factory.client!.guilds.cache.get(key)

      const cacheCommands = await guild?.commands.set(commands.map((command: CommandEntity) => ({
        ...command.context,
        ...command.roles.length && { defaultPermission: false },
      })))

      await guild?.commands.permissions.set({
        fullPermissions: await Promise.all(commands.map(async (command: CommandEntity) => {
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

  private emit (instance) {
    this.factory.client!.on(
      instance.event,
      async (...args: any[]) => {
        await instance.run(...args)
      }
    )
  }
}