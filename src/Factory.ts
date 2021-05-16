import path from 'path'
import Env from '@discord-factory/env'
import { fetch } from 'fs-recursive'
import { Container } from './Container'
import Dispatcher from './Dispatcher'
import Guard from './Guard'
import CommandHook from './hooks/CommandHook'
import Constructable from './Constructable'
import HookEntity from './entities/HookEntity'
import CommandRoleHook from './hooks/CommandRoleHook'
import CommandPermissionHook from './hooks/CommandPermissionHook'

export default class Factory {
  private static $instance: Factory
  public $container = new Container()

  public static getInstance () {
    if (!Factory.$instance) {
      Factory.$instance = new Factory()
    }
    return this.$instance
  }
  
  public async setup () {
    await this.loadProvider()
    /**
     * Defines the workspace base directory.
     * Retrieves all the files that are recursively
     * available in this directory
     */
    const root = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'build', 'src')
      : path.join(process.cwd(), 'src')

    const files = await fetch(root,
      [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
      'utf-8')

    /**
     * Creation of a new dispatcher whose role
     * will be to insert all the files retrieved previously into a queue.
     */
    const dispatcher = new Dispatcher(files)

    /**
     * Registration of hooks to be executed during the runtime.
     * @Todo Allow developers to extend this configuration through plugins.
     */
    const commandHook = new CommandHook()
    dispatcher.registerHook(
      new Constructable(
        'hook',
        commandHook.toString(),
        commandHook as HookEntity,
      ),
    )

    const commandRoleHook = new CommandRoleHook()
    dispatcher.registerHook(
      new Constructable(
        'hook',
        commandRoleHook.toString(),
        commandRoleHook as HookEntity,
      ),
    )

    const commandPermissionHook = new CommandPermissionHook()
    dispatcher.registerHook(
      new Constructable(
        'hook',
        commandPermissionHook.toString(),
        commandPermissionHook as HookEntity,
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
    await this.$container.client.login(Env.get('TOKEN'))

    /**
     * Initialize a Guard.
     * It performs the checks before the execution of the commands.
     */
    const guard = new Guard()

    /**
     * Applies guard to messages received
     * from the discord.js 'message' event.
     */
    this.$container.client.on('message', async (message) => {
      await guard.protect(message)
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
    const providers = await Promise.all(
      providersList.map(async (file) => {
        const withDefault = (await import(file.path)).default
        const provider = new withDefault()
        await provider.boot()

        return provider
      }))

    Factory.$instance.$container.providers = providers
  }
}