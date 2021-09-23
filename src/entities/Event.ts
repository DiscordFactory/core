import { ClientEvents } from 'discord.js'
import Constructable from '../utils/Constructable'
import { AddonContext } from '../types'
import EntityFile from '../utils/EntityFile'

export function Event<K extends keyof ClientEvents> (identifier: K) {
  return (target: Function) => {
    return class Event extends EventEntity<K> {
      constructor (context: any) {
        super(context, identifier, target.prototype.run, undefined)
      }
    } as any
  }
}

export class EventEntity<K extends keyof ClientEvents> extends Constructable<any> {
  public static type: string = 'event'

  constructor (
    public context: AddonContext<any> | undefined,
    public event: K,
    public run: (...args: Array<any>) => Promise<void>,
    public file: EntityFile | undefined
  ) {
    super(file)
  }
}

export abstract class BaseEvent {
  public abstract run (...args: any[]): Promise<void>
}