import { ClientEvents } from 'discord.js'
import { EventEntity } from '../entities/Event'
import { File } from 'fs-recursive'

export type ContainerType = 'event' | 'command' | 'hook' | 'middleware' | 'slash-command' | null

export type Instance<K extends keyof ClientEvents> = EventEntity<K>

export type QueueItem = {
  type: ContainerType
  default: any
  instance: Instance<any>
  file: File
}

// export type Context = HookEntity | EventEntity<any> | MiddlewareEntity | CommandEntity | SlashCommandEntity

export type Constructable<K extends keyof ClientEvents> = {
  type: ContainerType
  default: any
  instance: 'HookEntity' | EventEntity<K> | 'MiddlewareEntity' | 'CommandEntity'
  file: File
}