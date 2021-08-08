import Factory from '../Factory'
import { QueueItem } from '../types'
import { activeProvider } from '../helpers/Provider'
import HookEntity from '../entities/HookEntity'
import NodeEmitter from '../NodeEmitter'
import { BaseHook, HookInterface } from '../types/Hook'
import Manager from './Manager'

export default class HookManager extends Manager {
  public async register (item: QueueItem) {
    const $container = Factory.getInstance().$container

    const instance = new item.default()
    const hook = new HookEntity(instance.hook, instance.run, item.file)

    $container?.hooks.push(hook)
    NodeEmitter.listen(instance)

    await this.activeProvider(hook)
  }

  public registerHook (...hooks: BaseHook[]) {
    // @ts-ignore
    hooks.forEach((item: HookInterface) => {
      Factory.getInstance().$container?.hooks.push(new HookEntity(item.hook, item.run))
    })
  }

  public async activeProvider (hookEntity: HookEntity) {
    await activeProvider(
      Factory.getInstance().$container!,
      hookEntity,
    )
  }
}