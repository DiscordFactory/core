import Factory from '../Factory'
import { BaseEvent } from '../entities/Event'
import { BaseCommand } from './Command'
import { BaseHook } from './Hook'

export function CLICommand (options: { name: string, prefix: string, params: string[] }) {
  return (target: Function) => {
    target.prototype.name = options.name
    target.prototype.prefix = options.prefix
    target.prototype.params = options.params
  }
}

export abstract class BaseAddonCommand {
  public abstract run (): Promise<void>
}

export interface AddonCommand {
  name: string
  prefix: string
  params: string
  run (): Promise<void>
}

export abstract class BaseAddon {
  private factory: Factory | undefined
  public abstract registerCLI (): BaseAddonCommand[]
  public abstract registerEvents (): BaseEvent[]
  public abstract registerCommands (): BaseCommand[]
  public abstract registerHooks (): BaseHook[]

  private setFactory (factory: Factory) {
    this.factory = factory
  }

  public getFactory () {
    return this.factory
  }
}