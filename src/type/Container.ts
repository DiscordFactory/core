import File from 'fs-recursive/build/File'
import { ClientEvents } from 'discord.js'
import CommandEntity from '../entities/CommandEntity'
import HookEntity from '../entities/HookEntity'
import EventEntity from '../entities/EventEntity'
import MiddlewareEntity from '../entities/MiddlewareEntity'

export type ContainerType = 'event' | 'command' | 'hook' | 'middleware' | 'plugin' | null

export type Instance<K extends keyof ClientEvents> = HookEntity | EventEntity<K> | MiddlewareEntity | CommandEntity

export type Constructable<K extends keyof ClientEvents> = {
  type: ContainerType
  default: any
  instance: HookEntity | EventEntity<K> | MiddlewareEntity| CommandEntity
  file: File
}

export type CommandAlias = {
  [key: string]: CommandEntity
}