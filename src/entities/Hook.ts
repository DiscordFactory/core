import { File } from 'fs-recursive'
import Constructable from '../utils/Constructable'
import { HookType } from '../types'
import Factory from '../Factory'

export function Hook (identifier: HookType) {
  return (target: Function) => {
    return class Hook extends HookEntity {
      constructor (context: Factory) {
        super(context, identifier, target.prototype.run, null)
      }
    } as any
  }
}

export class HookEntity extends Constructable<any> {
  public static type: string = 'hook'

  constructor (
    public context: Factory,
    public type: HookType,
    public run: (...args: any[]) => Promise<void>,
    public file: File | null,
  ) {
    super(file)
  }
}

export abstract class BaseHook {
  public abstract run (...args: any): Promise<void>
}