import { File } from 'fs-recursive'
import { ContainerType } from '../type/Container'
import { ScopeContext, SlashContext } from '../interface/SlashCommandInterface'
import ConstructableEntity from './ConstructableEntity'

export default class SlashCommandEntity extends ConstructableEntity {
  public static type: ContainerType = 'slash-command'

  constructor (
    public scope: ScopeContext,
    public context: SlashContext,
    public run: (...args: Array<any>) => Promise<void>,
    file?: File,
  ) {
    super(SlashCommandEntity.type, file)
  }
}