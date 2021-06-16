import { GuildMember, Message } from 'discord.js'
import CommandEntity from '../entities/CommandEntity'

export default class CommandContext {
  constructor (
    readonly sender: GuildMember | null,
    readonly args: Array<string>,
    readonly message: Message,
    readonly command: CommandEntity,
    private cancelled: boolean = false,
  ) {
    this.setCancelled = this.setCancelled.bind(this)
  }

  /**
   * Allow or disallow the execution
   * of the parent command.
   * @param bool
   */
  public setCancelled (bool: boolean): void {
    this.cancelled = bool
  }

  /**
   * Checks if the order has been
   * executed or cancelled
   */
  public isCancelled (): boolean {
    return this.cancelled
  }
}