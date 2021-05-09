import { GuildMember, Message } from 'discord.js'
import { CommandInterface } from '../interface/CommandInterface'
import Constructable from '../Constructable'

export default class MiddlewareContext {
  private readonly groups: { [key: string]: string } | undefined

  constructor(
    readonly name: string,
    readonly sender: GuildMember | null,
    readonly args: Array<string>,
    readonly message: Message,
    readonly command: CommandInterface,
    readonly middleware: Constructable<any>,
  ) {
    this.groups = (middleware.instance as any).pattern?.exec(name)?.groups
  }

  public get(group: string): string | undefined {
    return this.groups ? this.groups[group] : undefined
  }
}