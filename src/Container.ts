import { ClientEvents, Collection } from 'discord.js'
import { EventEntity } from './entities/Event'
import { CommandEntity } from './entities/Command'
import { ProviderEntity } from './entities/Provider'

export default class Container {
  public events: EventEntity<keyof ClientEvents>[] = []
  public commands: CommandEntity[] = []
  public providers: ProviderEntity[] = []
  public cli: Collection<string, any> = new Collection()
}