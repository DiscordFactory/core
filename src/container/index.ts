import { Client, ClientEvents } from 'discord.js'
import { Constructable, ContainerModules } from '../type/Container'
import Event from './Event'

export default class Container<K extends keyof ClientEvents> {
  public client: Client = new Client()
  public events: Array<Event<any>> = []

  public register(module: ContainerModules, constructable: Constructable) {
    this[module].push(constructable)
  }
}