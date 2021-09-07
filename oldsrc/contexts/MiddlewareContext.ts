import { GuildMember, Message } from 'discord.js'
import MiddlewareEntity from '../entities/MiddlewareEntity'
import CommandEntity from '../entities/CommandEntity'

export default class MiddlewareContext {
  private readonly groups: { [key: string]: string } | undefined

  constructor (
    readonly name: string,
    readonly sender: GuildMember | null,
    readonly args: Array<string>,
    readonly message: Message,
    readonly command: CommandEntity,
    readonly middleware: MiddlewareEntity,
  ) {
    this.groups = middleware.pattern?.exec(name)?.groups
  }

  public get (group: string): string | undefined {
    return this.groups ? this.groups[group] : undefined
  }
}