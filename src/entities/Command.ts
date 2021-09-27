import { AddonContext, CommandContext, ContainerType, CommandGlobalContext, ScopeContext } from '../types'
import Constructable from '../utils/Constructable'
import { ApplicationCommandPermissionData, CommandInteraction } from 'discord.js'
import EntityFile from '../utils/EntityFile'
import Cooldown from '../utils/Cooldown'

export function Command (ctx: CommandGlobalContext) {
  return (target: Function) => {
    return class SlashCommand extends CommandEntity {
      constructor (context: any) {
        super(
          context,
          ctx.scope,
          ctx.permissions,
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
    public permissions: ApplicationCommandPermissionData[] = [],
    public cooldown: Cooldown | undefined,
    public ctx: CommandContext,
    public run: (...args: any[]) => Promise<void>,
    public file?: EntityFile | undefined,
  ) {
    super(file)
  }
}

export abstract class BaseCommand {
  public abstract run (interaction: CommandInteraction): Promise<void>
}