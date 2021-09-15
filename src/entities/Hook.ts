import { File } from 'fs-recursive'
import Constructable from '../utils/Constructable'
import { HookType } from '../types'
import { BaseAddon } from './Addon'

export function Hook (identifier: string) {
  return (target: Function) => {
    return class Hook extends HookEntity {
      constructor (context: any) {
        super(context, identifier as HookType, target.prototype.run, null)
      }
    } as any
  }
}

export class HookEntity extends Constructable<any> {
  public static type: string = 'hook'

  constructor (
    public context: BaseAddon<any> | undefined,
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