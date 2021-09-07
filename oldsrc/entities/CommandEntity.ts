import { Message, PermissionResolvable } from 'discord.js'
import { File } from 'fs-recursive'
import { ContainerType } from '../types'
import ConstructableEntity from './ConstructableEntity'
import MiddlewareEntity from './MiddlewareEntity'

export default class CommandEntity extends ConstructableEntity {
  public static type: ContainerType = 'command'

  constructor (
    public label: string,
    public description: string,
    public tag: string,
    public usages: Array<string> = [],
    public alias: Array<string> = [],
    public roles: Array<string> = [],
    public permissions: Array<PermissionResolvable> = [],
    public middlewares: Array<{ name: string; pointer: MiddlewareEntity }> = [],
    public run: (message: Message, args: Array<string>) => Promise<void>,
    file?: File,
  ) {
    super(CommandEntity.type, file)
  }
}