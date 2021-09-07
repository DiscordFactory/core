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