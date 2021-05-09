import { Message, PermissionResolvable } from 'discord.js'
import { MiddlewareInterface } from '../interface/MiddlewareInterface'

export default class CommandEntity {
  public static type: string = 'command'

  constructor(
    public label: string,
    public description: string,
    public tag: string,
    public usages: Array<string> = [],
    public alias: Array<string> = [],
    public roles: Array<string> = [],
    public permissions: Array<PermissionResolvable> = [],
    public middlewares: Array<{ name: string; pointer: MiddlewareInterface }> = [],
    public run: (message: Message, args: Array<string>) => Promise<void>,
  ) {}
}