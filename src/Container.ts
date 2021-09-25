import { ClientEvents, Collection } from 'discord.js'
import { EventEntity } from './entities/Event'
import { CommandEntity } from './entities/Command'
import { ProviderEntity } from './entities/Provider'
import { ContextMenuEntity } from './entities/ContextMenu'

export default class Container {
  public events: EventEntity<keyof ClientEvents>[] = []
  public commands: CommandEntity[] = []
  public contextMenu: ContextMenuEntity[] = []
  public providers: ProviderEntity[] = []
  public cli: Collection<string, any> = new Collection()
}