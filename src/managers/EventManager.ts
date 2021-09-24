import Factory from '../Factory'
import { EventEntity } from '../entities/Event'
import NodeEmitter from '../utils/NodeEmitter'
import { ProviderEntity } from '../entities/Provider'
import EntityFile from '../utils/EntityFile'
import { ClientEvents } from 'discord.js'
import { Events } from '../types'

export default class EventManager {
  constructor (public factory: Factory) {
  }

  public async register (): Promise<void> {
    const files = this.factory.ignitor.files.filter((file: any) => file.type === 'event')

    await Promise.all(
      files.map(async (item: any) => {
        const instance = new item.default()
        const entityFile = new EntityFile(item.file.path)

        const event = new EventEntity(
          undefined,
          instance.event,
          instance.run,
          entityFile
        )

        await this.emit(event)

        this.factory.ignitor.container.providers.forEach((provider: ProviderEntity) => {
          provider.load(event)
        })
      })
    )

    NodeEmitter.emit(
      'application::events::registered',
      this.factory.ignitor.container.commands
    )
  }

  private async emit (instance: EventEntity<keyof Events>) {
    if (!this.factory.shardManager?.shards.size) {
      this.factory.client!.on(
        instance.event as keyof ClientEvents,
        async (...args: any[]) => {
          await instance.run(...args)
        }
      )
    }
  }
}