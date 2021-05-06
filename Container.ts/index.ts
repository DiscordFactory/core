import { Client, ClientEvents } from 'discord.js'
import { Constructable, ContainerModules } from '../src/type/Container'
import EventEntity from '../src/entities/EventEntity'

export default class Container<K extends keyof ClientEvents> {
  public client: Client = new Client()
  public events: Array<EventEntity<any>> = []

  public register(module: ContainerModules, constructable: Constructable) {
    this[module].push(constructable)
  }
}