import { AddonContext } from '../types'

export function CLICommand (options: { name: string, prefix: string, usages: string[] }) {
  return (target: Function) => {
    return class Command extends CliCommandEntity {
      constructor (context: any) {
        super(
          context,
          options.name,
          options.prefix,
          options.usages,
          target.prototype.run
        )
      }
    } as any
  }
}

export abstract class BaseAddonCommand<Addon> {
  public context: AddonContext<Addon> | undefined
  public abstract run (...params: string[]): Promise<void>
}

export interface AddonCommand {
  name: string
  prefix: string
  params: string
  run (): Promise<void>
}

export class CliCommandEntity {
  constructor (
    public context: AddonContext<any> | undefined,
    public name: string,
    public prefix: string,
    public usages: string[],
    public run: (...args: Array<any>) => Promise<void>,
  ) {
  }
}

export abstract class BaseAddonHook<Addon> {
  public context: AddonContext<Addon> | undefined
  public abstract run (...props: any[]): Promise<void>
}

export abstract class BaseAddonEvent<Addon> {
  public context: AddonContext<Addon> | undefined
  public abstract run (...props: any[]): Promise<void>
}

export abstract class BaseAddon<Addon> {
  public abstract addonName: string
  public abstract registerCLI (): any[]
  public abstract registerEvents (): any[]
  public abstract registerCommands (): any[]
  public abstract registerHooks (): any[]
  public abstract defineKeys (): string[]

  protected constructor (public context: AddonContext<Addon>) {
  }
}