import File from 'fs-recursive/build/File'
import { ClientEvents } from 'discord.js'
import { ContainerType } from './type/Container'
import Factory from './Factory'
import EventEntity from './entities/EventEntity'
import NodeEmitter from './NodeEmitter'
import CommandEntity from './entities/CommandEntity'
import { HookInterface } from './interface/HookInterface'
import Constructable from './Constructable'
import HookEntity from "./entities/HookEntity";

export default class Dispatcher {
  constructor (private files: Map<string, File>) {
  }

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

  public async dispatch<K extends keyof ClientEvents>(queue: Array<Constructable<any>>) {
    if (!queue) {
      return
    }

    this.filter('hook', queue).forEach((constructable) => {
      const instance = new (constructable.model)()
      Factory.getInstance().$container.hooks.push({ ...constructable, instance })
      NodeEmitter.listen(instance)
    })

    this.filter('middleware', queue).forEach((constructable) => {
      const instance = new (constructable.model)()
      Factory.getInstance().$container.middlewares.push({ ...constructable, instance })
    })

    this.filter('event', queue).forEach((constructable) => {
      const instance = new (constructable.model)()
      Factory.getInstance().$container.events.push({ ...constructable, instance })
      Factory.getInstance().$container.client.on(
        instance.event, async (...args: Array<any>) => await instance.run(...args),
      )
    })

    this.filter('command', queue).forEach((constructable) => {
      const instance = new (constructable.model)()

      Factory.getInstance().$container.commands.push({ ...constructable, instance })
      Factory.getInstance().$container.commandAlias[instance.tag] = instance
      instance.alias.forEach((alias) => {
        Factory.getInstance().$container.commandAlias[alias] = instance
      })
    })
  }

  public filter<K extends keyof ClientEvents> (key: ContainerType, fragment: Array<Constructable<any>>) {
    return fragment.filter((constructable) => {
      return constructable!.type === key
    })
  }

  public registerHook (hook: Constructable<any>) {
    Factory.getInstance().$container.hooks.push(
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