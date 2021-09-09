import { File } from 'fs-recursive'
import Constructable from '../utils/Constructable'
import { HookType } from '../types'

export function Hook (identifier: HookType) {
  return (target: Function) => {
    return class Hook extends HookEntity {
      constructor () {
        super(identifier, target.prototype.run, null)
      }
    }
  }
}

export class HookEntity extends Constructable<any> {
  public static type: string = 'hook'

  constructor (
    public type: HookType,
    public run: (...args: Array<any>) => Promise<void>,
    public file: File | null
  ) {
    super(file)
  }
}

export abstract class BaseHook {
  public abstract run (...args: any): Promise<void>
}