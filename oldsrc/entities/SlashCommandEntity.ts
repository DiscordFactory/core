import { File } from 'fs-recursive'
import { ContainerType } from '../types'
import { ScopeContext, SlashOption } from '../types/SlashCommand'
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