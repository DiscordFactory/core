import { ClientEvents, Collection } from 'discord.js'
import { EventEntity } from './entities/Event'

export default class Container {
  public events: EventEntity<keyof ClientEvents>[] = []
  public cli: Collection<string, any> = new Collection()
  public providers: any = []
}