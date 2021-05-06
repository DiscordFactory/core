import { GuildMember, Message } from 'discord.js'
import { MiddlewareInterface } from '../interface/MiddlewareInterface'
import { CommandInterface } from '../interface/CommandInterface'

export default class MiddlewareContext {
  private readonly groups: { [key: string]: string } | undefined

  constructor(
    readonly name: string,
    readonly sender: GuildMember | null,
    readonly args: Array<string>,
    readonly message: Message,
    readonly command: CommandInterface,
    readonly middlewareInterface: MiddlewareInterface,
  ) {
    this.groups = middlewareInterface.pattern.exec(name)?.groups
  }

  public get(group: string): string | undefined {
    return this.groups ? this.groups[group] : undefined
  }
}