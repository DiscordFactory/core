import { Client, ClientEvents } from 'discord.js'
import { CommandAlias, Constructable, ContainerModules } from './type/Container'
import EventEntity from './entities/EventEntity'
import MiddlewareEntity from './entities/MiddlewareEntity'
import CommandEntity from './entities/CommandEntity'

export default class Container<K extends keyof ClientEvents> {
  public client: Client = new Client()
  public events: Array<EventEntity<any>> = []
  public middlewares: Array<MiddlewareEntity> = []
  public commands: Array<CommandEntity> = []
  public commandAlias: CommandAlias = {}

  public register(module: ContainerModules, constructable: Constructable) {
    this[module].push(constructable)
  }

  public registerAlias(alias: string, commandEntity: CommandEntity) {
    this.commandAlias[alias] = commandEntity
  }
}