import File from 'fs-recursive/build/File'
import { ClientEvents } from 'discord.js'
import { ContainerType, QueueItem } from './type/Container'
import Factory from './Factory'
import NodeEmitter from './NodeEmitter'
import HookEntity from './entities/HookEntity'
import { activeProvider } from './helpers/Provider'
import CommandEntity from './entities/CommandEntity'
import EventEntity from './entities/EventEntity'
import MiddlewareEntity from './entities/MiddlewareEntity'

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

        if (res.default.disabled) {
          return
        }

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
        const $container = Factory.getInstance().$container!
        const instance = new item.default()
        const hook = new HookEntity(instance.hook, instance.run, item.file)

        $container.hooks.push(hook)
        NodeEmitter.listen(instance)

        await activeProvider(
          $container,
          hook,
        )
      }),
    )

    /**
     * Retrieves middlewares from the queue,
     * adds them to the list of available hooks within the application.
     */
    await Promise.all(
      this.filter('middleware', queue).map(async (item) => {
        const $container = Factory.getInstance().$container!
        const instance = new item.default()
        const middleware = new MiddlewareEntity(instance.basePattern, instance.run, item.file)
        $container.middlewares.push(middleware)

        await activeProvider(
          $container,
          middleware,
        )
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
          const $container = Factory.getInstance().$container!
          const instance = new item.default()
          const event = new EventEntity(instance.event, instance.run, item.file)

          $container.events.push(event)
          $container.client.on(instance.event, async (...args: Array<any>) => {
            await instance.run(...args)
          })

          await activeProvider(
            $container,
            event,
          )
        }),
    )

    /**
     * Retrieves commands from the queue,
     * adds them to the list of available hooks within the application.
     */
    await Promise.all(
      this.filter('command', queue)
        .map(async (item) => {
          const $container = Factory.getInstance().$container!
          const { label, description, tag, usages, alias, roles, permissions, middlewares, run } = new item.default()

          const command = new CommandEntity(label, description, tag, usages, alias, roles, permissions, middlewares, run, item.file as any)
          $container.commands.push(command)
          $container.commandAlias[command.tag] = command

          command.alias.forEach((alias) => {
            $container.commandAlias[alias] = command
          })

          await activeProvider(
            $container,
            command,
          )
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
   * @param hook
   */
  public registerHook (entity: HookEntity) {
    Factory.getInstance().$container!.hooks.push(
      new HookEntity(
        entity.hook,
        entity.run,
        entity.file as any,
      ),
    )

    if (entity instanceof HookEntity) {
      NodeEmitter.listen(entity)
    }
  }
}