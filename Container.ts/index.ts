import { Client, ClientEvents } from 'discord.js'
import { Constructable, ContainerModules } from '../src/type/Container'
import BaseEvent from '../src/entities/BaseEvent'

export default class Container<K extends keyof ClientEvents> {
  public client: Client = new Client()
  public events: Array<BaseEvent<any>> = []

  public register(module: ContainerModules, constructable: Constructable) {
    this[module].push(constructable)
  }
}