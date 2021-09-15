import { AddonContext } from '../types'

export function CLICommand (options: { name: string, prefix: string, usages: string[] }) {
  return (target: Function) => {
    target.prototype.name = options.name
    target.prototype.prefix = options.prefix
    target.prototype.usages = options.usages
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