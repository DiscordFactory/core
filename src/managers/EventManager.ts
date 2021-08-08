import { ClientEvents } from 'discord.js'
import EventEntity from '../entities/EventEntity'
import Factory from '../Factory'
import { QueueItem } from '../type/Container'
import { activeProvider } from '../helpers/Provider'
import Manager from './Manager'

export default class EventManager extends Manager {
  public events: Array<EventEntity<keyof ClientEvents>> = []

  public async register (item: QueueItem) {
    const instance = new item.default()
    const event = new EventEntity(instance.event, instance.run, item.file)

    Factory.getInstance().$container?.events.push(event)
    Factory.getInstance().$container?.client.on(instance.event, async (...args: Array<any>) => {
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