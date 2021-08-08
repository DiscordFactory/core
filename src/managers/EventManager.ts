import EventEntity from '../entities/EventEntity'
import Factory from '../Factory'
import { QueueItem } from '../type/Container'
import { activeProvider } from '../helpers/Provider'
import Manager from './Manager'

export default class EventManager extends Manager {
  public async register (item: QueueItem) {
    const $container = Factory.getInstance().$container

    const instance = new item.default()
    const event = new EventEntity(instance.event, instance.run, item.file)

    $container?.events.push(event)
    $container?.client.on(instance.event, async (...args: Array<any>) => {
      await instance.run(...args)
    })

    await this.activeProvider(event)
  }

  public async activeProvider (event: EventEntity<any>) {
    await activeProvider(
      Factory.getInstance().$container!,
      event,
    )
  }
}