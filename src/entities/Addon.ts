import Factory from '../Factory'

export function CLICommand (options: { name: string, prefix: string, params: string[] }) {
  return (target: Function) => {
    target.prototype.name = options.name
    target.prototype.prefix = options.prefix
    target.prototype.params = options.params
  }
}

export abstract class BaseAddonCommand {
  public factory: Factory | undefined
  public abstract run (): Promise<void>
}

export interface AddonCommand {
  name: string
  prefix: string
  params: string
  run (): Promise<void>
}

export abstract class BaseAddonHook {
  public factory: Factory | undefined
  public abstract run (...props: any[]): Promise<void>
}

export abstract class BaseAddonEvent {
  public factory: Factory | undefined
  public abstract run (): Promise<void>
}

export abstract class BaseAddon {
  private factory: Factory | undefined
  public abstract addonName: string
  public abstract registerCLI (): any[]
  public abstract registerEvents (): any[]
  public abstract registerCommands (): any[]
  public abstract registerHooks (): any[]
  public abstract defineKeys (): string[]

  public setFactory (factory: Factory) {
    this.factory = factory
  }

  public getFactory () {
    return this.factory
  }
}