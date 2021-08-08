import Factory from '../Factory'
import { QueueItem } from '../type/Container'
import { activeProvider } from '../helpers/Provider'
import HookEntity from '../entities/HookEntity'
import NodeEmitter from '../NodeEmitter'
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

  public async activeProvider (hookEntity: HookEntity) {
    await activeProvider(
      Factory.getInstance().$container!,
      hookEntity,
    )
  }
}