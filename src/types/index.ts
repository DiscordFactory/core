import { ClientEvents } from 'discord.js'
import { File } from 'fs-recursive'
import HookEntity from '../entities/HookEntity'
import EventEntity from '../entities/EventEntity'
import MiddlewareEntity from '../entities/MiddlewareEntity'
import CommandEntity from '../entities/CommandEntity'

export type ContainerType = 'event' | 'command' | 'hook' | 'middleware' | 'slash-command' | null

export type Instance<K extends keyof ClientEvents> = HookEntity | EventEntity<K> | MiddlewareEntity | CommandEntity

export type QueueItem = {
  type: ContainerType
  default: any
  instance: Instance<any>
  file: File
}

export type Context = HookEntity | EventEntity<any> | MiddlewareEntity | CommandEntity

export type Constructable<K extends keyof ClientEvents> = {
  type: ContainerType
  default: any
  instance: HookEntity | EventEntity<K> | MiddlewareEntity | CommandEntity
  file: File
}

export type CommandAlias = {
  [key: string]: CommandEntity
}