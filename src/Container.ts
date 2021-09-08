import { ClientEvents, Collection } from 'discord.js'
import { EventEntity } from './entities/Event'
import { CommandEntity } from './entities/Command'

export default class Container {
  public events: EventEntity<keyof ClientEvents>[] = []
  public commands: CommandEntity[] = []
  public cli: Collection<string, any> = new Collection()
  public providers: any = []
}