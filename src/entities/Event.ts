import { ClientEvents } from 'discord.js'
import { File } from 'fs-recursive'
import Constructable from '../utils/Constructable'

export function Event<K extends keyof ClientEvents> (identifier: K) {
  return (target: Function) => {
    return class Event extends EventEntity<K> {
      constructor () {
        super(identifier, target.prototype.run, null)
      }
    }
  }
}

export class EventEntity<K extends keyof ClientEvents> extends Constructable<any> {
  public static type: string = 'event'

  constructor (
    public event: K,
    public run: (...args: Array<any>) => Promise<void>,
    public file: File | null
  ) {
    super(file)
  }
}

export abstract class BaseEvent {
  public abstract run (...args: any): Promise<void>
}