import { AddonContext, CliCommandContext, CliContextRuntime } from '../types'

export function CLI (context: CliCommandContext) {
  return (target: Function) => {
    target.prototype.prefix = context.prefix
    target.prototype.description = context.description
    target.prototype.args = context.args
    target.prototype.config = context.config
    target.prototype.options = context.options
    target.prototype.alias = context.alias
    target.prototype.exemple = context.exemple
  }
}

export interface CliCommand extends CliCommandContext {
  run (context: CliContextRuntime): Promise<void>
}

export abstract class BaseCli<Addon> {
  public abstract run (context: CliContextRuntime): Promise<void>
  protected constructor (public context: AddonContext<Addon> | undefined) {
  }
}