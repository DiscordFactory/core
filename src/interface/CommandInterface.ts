import { Message, PermissionResolvable } from 'discord.js'
import { MiddlewareInterface } from './MiddlewareInterface'

export interface BaseCommand {
  run(message: Message, args: Array<string>): Promise<void>
}

export interface CommandInterface extends BaseCommand {
  label: string
  description: string
  usages: Array<string>
  tag: string
  alias?: Array<string>
  roles?: Array<string>
  permissions?: Array<PermissionResolvable>
  middlewares: Array<{ name: string; pointer: MiddlewareInterface }>
}