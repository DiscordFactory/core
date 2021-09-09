import { ClientEvents } from 'discord.js'
import { File } from 'fs-recursive'
import Constructable from '../utils/Constructable'

export class ProviderEntity<K extends keyof ClientEvents> extends Constructable<any> {
  public static type: string = 'provider'

  constructor (
    public boot: () => Promise<void>,
    public load: () => Promise<void>,
    public ok: () => Promise<void>,
    public file: File | null
  ) {
    super(file)
  }
}

export abstract class BaseProvider {
  public abstract boot: () => Promise<void>
  public abstract load: () => Promise<void>
  public abstract ok: () => Promise<void>
}