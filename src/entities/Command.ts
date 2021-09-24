import { AddonContext, ContainerType, Context, ScopeContext, SlashOption } from '../types'
import Constructable from '../utils/Constructable'
import { CommandInteraction } from 'discord.js'
import EntityFile from '../utils/EntityFile'
import Cooldown from '../utils/Cooldown'

export function Command (ctx: Context) {
  return (target: Function) => {
    return class SlashCommand extends CommandEntity {
      constructor (context: any) {
        super(
          context,
          ctx.scope,
          ctx.roles,
          ctx.cooldown?.count || ctx.cooldown?.time
            ? new Cooldown(ctx.cooldown)
            : undefined,
          { ...ctx.options, name: ctx.options.name.toLowerCase() },
          target.prototype.run,
        )
      }
    } as any
  }
}

export class CommandEntity extends Constructable<any> {
  public static type: ContainerType = 'command'

  constructor (
    public context: AddonContext<any> | undefined,
    public scope: ScopeContext,
    public roles: string[] = [],
    public cooldown: Cooldown | undefined,
    public ctx: SlashOption,
    public run: (...args: any[]) => Promise<void>,
    public file?: EntityFile | undefined,
  ) {
    super(file)
  }
}

export abstract class BaseCommand {
  public abstract run (interaction: CommandInteraction): Promise<void>
}