import Factory from '../Factory'
import { EventEntity } from '../entities/Event'
import { QueueItem } from '../types'
import { activeProvider } from '../utils'
import { File } from 'fs-recursive'
import { Collection } from 'discord.js'

export default class EventManager {
  private events: Collection<string, any> = new Collection()

  constructor (public factory: Factory) {
  }

  public async register () {
    const container = this.factory.ignitor.container.events
    const files = this.factory.ignitor.files.filter((file: any) => file.type === 'event')

    await Promise.all(
      files.map(async (item: any) => {
        const instance = new item.default()
        const event = new EventEntity(
          instance.event,
          instance.run,
          item.file
        )

        this.emit(instance)

        await activeProvider(
          this.factory.ignitor.container,
          event
        )
      })
    )
  }

  private emit (instance) {
    this.factory.client!.on(
      instance.event,
      async (...args: any[]) => {
        console.log(true)
        await instance.run(...args)
      }
    )
  }
}