import { ClientEvents } from 'discord.js'
import { ContainerModules } from '../type/Container';
import Event from './Event'

export default class Container<K extends keyof ClientEvents> {
  public events: Array<Event<any>> = []

  public register(module: ContainerModules, event: Event<K>) {
    this[module].push(module)
  }
}