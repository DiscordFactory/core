import { ClientEvents } from 'discord.js'
import File from 'fs-recursive/build/File'
import { ContainerType } from '../type/Container'
import ConstructableEntity from './ConstructableEntity'

export default class EventEntity<K extends keyof ClientEvents> extends ConstructableEntity {
  public static type: ContainerType = 'event'

  constructor (public event: K, public run: (...args: Array<any>) => Promise<void>, file?: File) {
    super(EventEntity.type, file as any)
  }
}