import { ClientEvents } from 'discord.js'
import { ContainerType } from '../type/Container'

export default class EventEntity<K extends keyof ClientEvents> {
  public static type: ContainerType = 'event'

  constructor (public event: K, public run: (...args: Array<any>) => Promise<void>) {
  }
}