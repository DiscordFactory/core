import path from 'path'
import { fetch } from 'fs-recursive'
import moduleAliases from 'module-alias'
import { Client, Intents, PartialTypes } from 'discord.js'
import { Container } from './Container'
import Dispatcher from './Dispatcher'
import CommandHook from './hooks/CommandHook'
import CommandRoleHook from './hooks/CommandRoleHook'
import CommandPermissionHook from './hooks/CommandPermissionHook'
import EnvironmentManager from './managers/EnvironmentManager'
import { root } from './helpers'
import EventManager from './managers/EventManager'
import CommandManager from './managers/CommandManager'
import HookManager from './managers/HookManager'
import SlashCommandManager from './managers/SlashCommandManager'
import MiddlewareManager from './managers/MiddlewareManager'

export default class Factory {
  private static $instance: Factory

  public environmentManager: EnvironmentManager = new EnvironmentManager()
  public eventManager: EventManager = new EventManager()
  public commandManager: CommandManager = new CommandManager()
  public hookManager: HookManager = new HookManager()
  public slashCommandManager: SlashCommandManager = new SlashCommandManager()
  public middlewareManager: MiddlewareManager = new MiddlewareManager()

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
     * Selects the selected environment types
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
    Factory.getInstance().hookManager.registerHook(
      new CommandHook(),
      new CommandRoleHook(),
      new CommandPermissionHook(),
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

    /**
     * Instantiation of the new slashCommands (discord.js 13).
     * Registration of the listener associated with each command.
     */
    const slashCommandManager = Factory.getInstance().slashCommandManager
    await slashCommandManager.registerSlashInstance()
    await slashCommandManager.initializeSlashCommands()

    /**
     * Initialization of the application's commands through the MessageCreate event
     * then activation of the Guard.
     */
    const commandManager = Factory.getInstance().commandManager
    await commandManager.initializeCommands()

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
}