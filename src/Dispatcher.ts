import File from 'fs-recursive/build/File'
import { ClientEvents } from 'discord.js'
import { ContainerType } from './type/Container'
import Factory from './Factory'
import NodeEmitter from './NodeEmitter'
import Constructable from './Constructable'
import HookEntity from './entities/HookEntity'
import { activeProvider } from './helpers/Provider'

export default class Dispatcher {
  constructor (private files: Map<string, File>) {
  }

  /**
   * Triggers recursive retrieval
   * of command files, middleware, hooks and events
   * then create new Constructable.
   * @return Promise<Array<Constructable<any>>>
   */
  public async load<K extends keyof ClientEvents>(): Promise<Array<Constructable<any>>> {
    const files = Array.from(this.files, ([_, file]) => ({ ...file }))
    const queue = await Promise.all(files.map(async (file) => {
      const res = await import(file.path)
      if (res?.default?.type) {
        return new Constructable(
          res.default.type,
          res.default,
          undefined,
          file as File,
        )
      }
    }))
    return queue.filter(q => q) as Array<Constructable<any>>
  }

  /**
   * Distributes files according to their
   * module and processes them at the same time.
   * @param queue Array<Constructable<any>>
   */
  public async dispatch<K extends keyof ClientEvents>(queue: Array<Constructable<any>>): Promise<void> {
    if (!queue) {
      return
    }

    /**
     * Retrieves hooks from the queue,
     * adds them to the list of available hooks within the application,
     * and activates the event listener.
     */
    await Promise.all(
      this.filter('hook', queue).map(async (constructable) => {
        const $container = Factory.getInstance().$container!
        const instance = new (constructable.model)()
        $container.hooks.push({ ...constructable, instance })
        NodeEmitter.listen(instance)
        await activeProvider(
          $container,
          { ...constructable, instance },
        )
      }),
    )

    /**
     * Retrieves middlewares from the queue,
     * adds them to the list of available hooks within the application.
     */
    await Promise.all(
      this.filter('middleware', queue).map(async (constructable) => {
        const $container = Factory.getInstance().$container!
        const instance = new (constructable.model)()
        $container.middlewares.push({ ...constructable, instance })
        await activeProvider(
          $container,
          { ...constructable, instance },
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
        .map(async(constructable) => {
          const $container = Factory.getInstance().$container!
          const instance = new (constructable.model)()
  
          $container.events.push({ ...constructable, instance })
          $container.client.on(instance.event, async (...args: Array<any>) => {
            await instance.run(...args)
          })
  
          await activeProvider(
            $container,
            { ...constructable, instance },
          )
        }),
    )

    /**
     * Retrieves commands from the queue,
     * adds them to the list of available hooks within the application.
     */
    await Promise.all(
      this.filter('command', queue)
        .map(async (constructable) => {
          const $container = Factory.getInstance().$container!
          const instance = new (constructable.model)()

          $container.commands.push({ ...constructable, instance })
          $container.commandAlias[instance.tag] = instance

          instance.alias.forEach((alias) => {
            $container.commandAlias[alias] = instance
          })

          await activeProvider(
            $container,
            { ...constructable, instance },
          )
        }),
    )
  }

  /**
   * Returns the entirety of a requested module.
   * @param key
   * @param fragment
   */
  public filter<K extends keyof ClientEvents> (key: ContainerType, fragment: Array<Constructable<any>> = []) {
    return fragment.filter((constructable) => {
      return constructable!.type === key
    })
  }

  /**
   * Registers a new hook to be executed
   * during the application's life cycle.
   * @param hook
   */
  public registerHook (hook: Constructable<any>) {
    Factory.getInstance().$container!.hooks.push(
      new Constructable(
        hook.type,
        hook.model,
        hook.instance,
        hook.file,
      ),
    )

    if (hook.instance instanceof HookEntity) {
      NodeEmitter.listen(hook.instance)
    }
  }
}