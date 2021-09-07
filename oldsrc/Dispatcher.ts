import File from 'fs-recursive/build/File'
import { ClientEvents } from 'discord.js'
import { ContainerType, QueueItem } from './types'
import Factory from './Factory'
import NodeEmitter from './NodeEmitter'
import HookEntity from './entities/HookEntity'

export default class Dispatcher {
  constructor (private files: Map<string, File>) {
  }

  /**
   * Triggers recursive retrieval
   * of command files, middleware, hooks and events
   * then create new Constructable.
   * @return Promise<Array<Constructable<any>>>
   */
  public async load<K extends keyof ClientEvents> (): Promise<Array<QueueItem>> {
    const files = Array.from(this.files, ([_, file]) => ({ ...file }))
    const queue: Array<any> = await Promise.all(
      files.map(async (file) => {
        const res = await import(file.path)

        if (res?.default?.type) {
          return {
            type: res.default.type,
            default: res.default,
            file,
          } as QueueItem
        }
      }))

    return queue.filter(q => q)
  }

  /**
   * Distributes files according to their
   * module and processes them at the same time.
   * @param queue Array<Constructable<any>>
   */
  public async dispatch<K extends keyof ClientEvents> (queue: Array<QueueItem>): Promise<void> {
    if (!queue) {
      return
    }

    /**
     * Retrieves hooks from the queue,
     * adds them to the list of available hooks within the application,
     * and activates the event listener.
     */
    await Promise.all(
      this.filter('hook', queue).map(async (item) => {
        const hookManager = Factory.getInstance().hookManager
        await hookManager.register(item)
      }),
    )

    /**
     * Retrieves middlewares from the queue,
     * adds them to the list of available hooks within the application.
     */
    await Promise.all(
      this.filter('middleware', queue)
        .map(async (item) => {
          const middlewareManager = Factory.getInstance().middlewareManager
          await middlewareManager.register(item)
        }),
    )

    /**
     * Retrieves events from the queue,
     * adds them to the list of available hooks within the application,
     * registrations within the discord.js instance.
     */
    await Promise.all(
      this.filter('event', queue)
        .map(async (item) => {
          const eventManager = Factory.getInstance().eventManager
          await eventManager.register(item)
        }),
    )

    /**
     * Retrieves events from the queue,
     * adds them to the list of available hooks within the application,
     * registrations within the discord.js instance.
     */
    await Promise.all(
      this.filter('slash-command', queue)
        .map(async (item) => {
          const slashCommandManager = Factory.getInstance().slashCommandManager
          await slashCommandManager.register(item)
        }),
    )

    /**
     * Retrieves commands from the queue,
     * adds them to the list of available hooks within the application.
     */
    await Promise.all(
      this.filter('command', queue)
        .map(async (item) => {
          const commandManager = Factory.getInstance().commandManager
          await commandManager.register(item)
        }),
    )
  }

  /**
   * Returns the entirety of a requested module.
   * @param key
   * @param fragment
   */
  public filter<K extends keyof ClientEvents> (key: ContainerType, fragment: Array<QueueItem> = []) {
    return fragment.filter((item) => {
      return item.type === key
    })
  }

  /**
   * Registers a new hook to be executed
   * during the application's life cycle.
   * @param entity
   */
  public registerHook (entity: HookEntity) {
    Factory.getInstance().$container!.hooks.push(
      new HookEntity(
        entity.hook,
        entity.run,
        entity.file as any,
      ),
    )

    NodeEmitter.listen(entity)
  }
}