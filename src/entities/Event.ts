import { ClientEvents } from 'discord.js'
import { File } from 'fs-recursive'
import Constructable from '../utils/Constructable'
import Factory from '../Factory'

export function Event<K extends keyof ClientEvents> (identifier: K) {
  return (target: Function) => {
    return class Event extends EventEntity<K> {
      constructor (factory: Factory) {
        super(factory, identifier, target.prototype.run, null)
      }
    } as any
  }
}

export class EventEntity<K extends keyof ClientEvents> extends Constructable<any> {
  public static type: string = 'event'

  constructor (
    public factory: Factory,
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