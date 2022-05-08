import { AddonContext, ApplicationContextOption, ContainerType, ApplicationGlobalContext, ScopeContext } from '../types'
import Constructable from '../utils/Constructable'
import { ApplicationCommandPermissionData, ContextMenuInteraction } from 'discord.js'
import EntityFile from '../utils/EntityFile'
import Cooldown from '../utils/Cooldown'

export function ContextMenu (ctx: ApplicationGlobalContext) {
  return (target: Function) => {
    return class ContextMenu extends ContextMenuEntity {
      constructor (context: any) {
        super(
          context,
          ctx.scope,
          ctx.cooldown?.count || ctx.cooldown?.time
            ? new Cooldown(ctx.cooldown)
            : undefined,
          { ...ctx.options, type: ctx.options.type as any },
          target.prototype.run,
        )
      }
    } as any
  }
}

export class ContextMenuEntity extends Constructable<any> {
  public static type: ContainerType = 'context-menu'

  constructor (
    public context: AddonContext<any> | undefined,
    public scope: ScopeContext,
    public cooldown: Cooldown | undefined,
    public ctx: ApplicationContextOption,
    public run: (...args: any[]) => Promise<void>,
    public file?: EntityFile | undefined,
  ) {
    super(file)
  }
}

export abstract class BaseContextMenu {
  public abstract run (interaction: ContextMenuInteraction): Promise<void>
}