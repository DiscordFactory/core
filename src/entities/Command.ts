import { File } from 'fs-recursive'
import { ContainerType, Context, ScopeContext, SlashOption } from '../types'
import Constructable from '../utils/Constructable'
import { CommandInteraction } from 'discord.js'
import Factory from '../Factory'

export function Command (context: Context) {
  return (target: Function) => {
    return class SlashCommand extends CommandEntity {
      constructor (factory: Factory) {
        super(
          factory,
          context.scope,
          context.roles,
          { ...context.options, name: context.options.name.toLowerCase() },
          target.prototype.run
        )
      }
    } as any
  }
}

export class CommandEntity extends Constructable<any> {
  public static type: ContainerType = 'command'

  constructor (
    public factory: Factory,
    public scope: ScopeContext,
    public roles: string[] = [],
    public context: SlashOption,
    public run: (...args: Array<any>) => Promise<void>,
    public file?: File,
  ) {
    super(file)
  }
}

export abstract class BaseCommand {
  public abstract run (interaction: CommandInteraction): Promise<void>
}