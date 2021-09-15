import { File } from 'fs-recursive'
import Constructable from '../utils/Constructable'
import { EntityResolvable } from '../types'

export class ProviderEntity extends Constructable<any> {
  public static type: string = 'provider'

  constructor (
    public boot: () => Promise<void>,
    public load: (file: EntityResolvable) => Promise<void>,
    public ok: () => Promise<void>,
    public file: File | undefined,
  ) {
    super(file)
  }
}

export abstract class BaseProvider {
  public abstract boot: () => Promise<void>
  public abstract load: (file: EntityResolvable) => Promise<void>
  public abstract ok: () => Promise<void>
}