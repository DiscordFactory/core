import { File } from 'fs-recursive'
import { ContainerType, Context, ScopeContext, SlashOption } from '../types'
import Constructable from '../utils/Constructable'
import { CommandInteraction } from 'discord.js'

export function Command (context: Context) {
  return (target: Function) => {
    return class SlashCommand extends CommandEntity {
      constructor () {
        super(
          context.scope,
          context.roles,
          { ...context.options, name: context.options.name.toLowerCase() },
          target.prototype.run
        )
      }
    }
  }
}

export class CommandEntity extends Constructable<any> {
  public static type: ContainerType = 'command'

  constructor (
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