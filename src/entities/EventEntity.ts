import { ClientEvents } from 'discord.js'
import { File } from 'fs-recursive'
import { ContainerType } from '../types'
import ConstructableEntity from './ConstructableEntity'

export default class EventEntity<K extends keyof ClientEvents> extends ConstructableEntity {
  public static type: ContainerType = 'event'

  constructor (public event: K, public run: (...args: Array<any>) => Promise<void>, file?: File) {
    super(EventEntity.type, file as any)
  }
}