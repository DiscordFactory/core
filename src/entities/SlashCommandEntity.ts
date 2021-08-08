import { File } from 'fs-recursive'
import { ContainerType } from '../type/Container'
import { ScopeContext, SlashOption } from '../interface/SlashCommandInterface'
import ConstructableEntity from './ConstructableEntity'

export default class SlashCommandEntity extends ConstructableEntity {
  public static type: ContainerType = 'slash-command'

  constructor (
    public scope: ScopeContext,
    public roles: string[] = [],
    public context: SlashOption,
    public run: (...args: Array<any>) => Promise<void>,
    file?: File,
  ) {
    super(SlashCommandEntity.type, file)
  }
}