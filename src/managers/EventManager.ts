import Factory from '../Factory'
import { EventEntity } from '../entities/Event'
import { activeProvider } from '../utils'
import NodeEmitter from '../utils/NodeEmitter'

export default class EventManager {
  constructor (public factory: Factory) {
  }

  public async register () {
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

    NodeEmitter.emit(
      'application::events::registered',
      this.factory.ignitor.container.commands
    )
  }

  private emit (instance) {
    this.factory.client!.on(
      instance.event,
      async (...args: any[]) => {
        await instance.run(...args)
      }
    )
  }
}