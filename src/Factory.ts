import path from 'path'
import { fetch } from 'fs-recursive'
import moduleAliases from 'module-alias'
import {
  ApplicationCommand,
  ApplicationCommandData,
  Client,
  Collection,
  Intents,
  Interaction,
  PartialTypes,
} from 'discord.js'
import { Container } from './Container'
import Dispatcher from './Dispatcher'
import Guard from './Guard'
import CommandHook from './hooks/CommandHook'
import HookEntity from './entities/HookEntity'
import CommandRoleHook from './hooks/CommandRoleHook'
import CommandPermissionHook from './hooks/CommandPermissionHook'
import SlashCommandEntity from './entities/SlashCommandEntity'
import { SlashOption } from './interface/SlashCommandInterface'
import EnvironmentManager from './managers/EnvironmentManager'
import { root } from './helpers'
import EventManager from './managers/EventManager'

export default class Factory {
  private static $instance: Factory

  public environmentManager: EnvironmentManager = new EnvironmentManager()
  public eventManager: EventManager = new EventManager()

  public $container: Container | undefined

  public static getInstance () {
    if (!Factory.$instance) {
      Factory.$instance = new Factory()
    }
    return this.$instance
  }

  public async setup () {
    this.registerAliases()

    /**
     * Selects the selected environment type
     * between .env, json and yaml.
     */
    await this.environmentManager.load()

    /**
     * Create service container with discord client
     * with partials if exists
     */
    const partials: PartialTypes[] = this.environmentManager.get('PARTIALS')
    const intents: string[] = this.environmentManager.get('INTENTS')

    const client = new Client({
      intents: intents.map((intent: string) => Intents.FLAGS[intent]),
      partials,
    })
    this.$container = new Container(client)

    await this.loadProvider()
    /**
     * Defines the workspace base directory.
     * Retrieves all the files that are recursively
     * available in this directory
     */
    const files = await fetch(root,
      [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
      'utf-8',
      ['node_modules'])

    /**
     * Creation of a new dispatcher whose role
     * will be to insert all the files retrieved previously into a queue.
     */
    const dispatcher = new Dispatcher(files)

    /**
     * Registration of hooks to be executed during the runtime.
     * @Todo Allow developers to extend this configuration through plugins.
     */
    const commandHook = new CommandHook() as any
    dispatcher.registerHook(
      new HookEntity(
        commandHook.hook,
        commandHook.run,
      ),
    )

    const commandRoleHook = new CommandRoleHook() as any
    dispatcher.registerHook(
      new HookEntity(
        commandRoleHook.hook,
        commandRoleHook.run,
      ),
    )

    const commandPermissionHook = new CommandPermissionHook() as any
    dispatcher.registerHook(
      new HookEntity(
        commandPermissionHook.hook,
        commandPermissionHook.run,
      ),
    )

    /**
     * Fetch all files then put them into the queue.
     */
    const queue = await dispatcher.load()

    if (!queue) {
      return
    }

    /**
     * From the queue, distribute the files
     * in each module to process them separately.
     */
    await dispatcher.dispatch(queue)

    /**
     * Creation and connection of the bot instance
     * within the Discord service as a bot application.
     */
    const token = this.environmentManager.get('APP_TOKEN')
    const messages = this.environmentManager.get('MESSAGES')

    if (!token) {
      throw new Error(messages.ENVIRONMENT_FILE_TOKEN_MISSING || 'The prefix is missing in the environment file.')
    }

    await this.$container.client.login(token)

    const globalCommands = this.$container.slashCommands
      .map((command: SlashCommandEntity) => command.scope === 'GLOBAL' && {
        ...command.context,
        permissions: command.roles.map((role: string) => ({ id: role, type: 'ROLE', permission: true })),
      })
      .filter(a => a) as SlashOption[]

    await this.$container!.client.application?.commands.set(globalCommands as unknown as ApplicationCommandData[])

    const guildCommandEntities = this.$container.slashCommands
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

    collection.map(async (commands, key) => {
      const guild = client.guilds.cache.get(key)

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

    /**
     * Initialize a Guard.
     * It performs the checks before the execution of the commands.
     */
    const guard = new Guard()

    /**
     * Applies guard to messages received
     * from the discord.js 'message' event.
     */
    this.$container.client.on('messageCreate', async (message) => {
      await guard.protect(message)
    })

    this.$container.client.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isCommand()) {
        return
      }

      const command = this.$container?.slashCommands.find((command) => {
        return command.context.name === interaction.commandName.toLowerCase()
      })

      if (!command) {
        return
      }

      await command.run(interaction)
    })

    /**
     * Issued upon completion
     * of the application start-up.
     */
    await Promise.all(
      this.$container.providers.map(async (provider) => {
        await provider.ready()
      }),
    )
  }

  /**
   * Saves the aliases before reading the files
   */
  public registerAliases () {
    moduleAliases.addAliases({
      App: process.env.NODE_ENV === 'production'
        ? path.join(process.cwd(), 'build', 'src')
        : path.join(process.cwd(), 'src'),
    })
  }

  /**
   * Retrieves providers and adds them
   * to the application instance.
   * @private
   */
  protected async loadProvider () {
    const root = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'build', 'providers')
      : path.join(process.cwd(), 'providers')

    const files = await fetch(root,
      [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
      'utf-8')

    const providersList = Array.from(files, ([_, file]) => ({ ...file }))
    this.$container!.providers = await Promise.all(
      providersList.map(async (file) => {
        const withDefault = (await import(file.path)).default
        const provider = new withDefault()
        await provider.boot()

        return provider
      }))
  }

  // private async loadEnvironment () {
  //   const environment = await fetch(process.cwd(),
  //     ['env', 'json', 'yaml', 'yml'],
  //     'utf-8',
  //     ['node_modules'])
  //
  //   const environments = Array.from(environment.entries())
  //     .filter(([_, file]) => file.filename === 'environment' || file.extension === 'env')
  //     .map(([_, file]) => file)
  //
  //   const env = environments.find(file => file.extension === 'env')
  //   if (env) {
  //     return this.$env = {
  //       type: env.extension,
  //       path: env.path,
  //       content: '',
  //     }
  //   }
  //
  //   const json = environments.find(file => file.extension === 'json')
  //   if (json) {
  //     const content = await json.getContent('utf-8')
  //     return this.$env = {
  //       type: json.extension,
  //       path: json.path,
  //       content: content!.toString(),
  //     }
  //   }
  //
  //   const yaml = environments.find(file => file.extension === 'yaml' || file.extension === 'yml')
  //   if (yaml) {
  //     const content = await yaml.getContent('utf-8')
  //     return this.$env = {
  //       type: yaml.extension,
  //       path: yaml.path,
  //       content: content!.toString(),
  //     }
  //   }
  //
  //   throw new Error('Environment file is missing, please create one.')
  // }
}