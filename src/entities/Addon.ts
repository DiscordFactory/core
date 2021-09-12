import { AddonContext } from '../types'

export function CLICommand (options: { name: string, prefix: string, params: string[] }) {
  return (target: Function) => {
    target.prototype.name = options.name
    target.prototype.prefix = options.prefix
    target.prototype.params = options.params
  }
}

export abstract class BaseAddonCommand {
  public context: AddonContext | undefined
  public abstract run (): Promise<void>
}

export interface AddonCommand {
  name: string
  prefix: string
  params: string
  run (): Promise<void>
}

export abstract class BaseAddonHook {
  public context: AddonContext | undefined
  public abstract run (...props: any[]): Promise<void>
}

export abstract class BaseAddonEvent {
  public context: AddonContext | undefined
  public abstract run (): Promise<void>
}

export abstract class BaseAddon {
  private context: AddonContext | undefined
  public abstract addonName: string
  public abstract registerCLI (): any[]
  public abstract registerEvents (): any[]
  public abstract registerCommands (): any[]
  public abstract registerHooks (): any[]
  public abstract defineKeys (): string[]

  public setContext (context: AddonContext) {
    this.context = context
  }

  public getContext () {
    return this.context
  }
}