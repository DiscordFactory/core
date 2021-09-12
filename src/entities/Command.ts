import { File } from 'fs-recursive'
import { ContainerType, Context, ScopeContext, SlashOption } from '../types'
import Constructable from '../utils/Constructable'
import { CommandInteraction } from 'discord.js'
import Factory from '../Factory'

export function Command (ctx: Context) {
  return (target: Function) => {
    return class SlashCommand extends CommandEntity {
      constructor (context: Factory) {
        super(
          context,
          ctx.scope,
          ctx.roles,
          { ...ctx.options, name: ctx.options.name.toLowerCase() },
          target.prototype.run
        )
      }
    } as any
  }
}

export class CommandEntity extends Constructable<any> {
  public static type: ContainerType = 'command'

  constructor (
    public context: Factory,
    public scope: ScopeContext,
    public roles: string[] = [],
    public ctx: SlashOption,
    public run: (...args: Array<any>) => Promise<void>,
    public file?: File,
  ) {
    super(file)
  }
}

export abstract class BaseCommand {
  public abstract run (interaction: CommandInteraction): Promise<void>
}