import { ApplicationCommandOption, ClientEvents } from 'discord.js'
import { EventEntity } from '../entities/Event'
import { File } from 'fs-recursive'
import { CommandEntity } from '../entities/Command'
import { HookEntity } from '../entities/Hook'
import { ProviderEntity } from '../entities/Provider'

export type ContainerType = 'event' | 'command' | 'hook' | 'middleware'

export type HookType = 'application::starting'
  | 'application::ok'
  | 'application::client::login'
  | 'application::commands::registered'
  | 'application::events::registered'
  | 'application::hooks::registered'

export type Instance<K extends keyof ClientEvents> = EventEntity<K>

export type QueueItem = {
  type: ContainerType
  default: any
  instance: Instance<any>
  file: File
}

export type Constructable<K extends keyof ClientEvents> = {
  type: ContainerType
  default: any
  instance: HookEntity | EventEntity<K> | CommandEntity
  file: File
}

export type ScopeContext = 'GLOBAL' | string[]

export type SlashOption = {
  name: string
  description: string
  options: ApplicationCommandOption[]
}

export type Context = {
  scope: ScopeContext
  roles?: string[]
  options: SlashOption
}

export type CommandContainer = CommandEntity[]

export type EventContainer = EventEntity<any>[]

export type HookContainer = HookEntity[]

export type ProviderContainer = ProviderEntity[]

export type EntityResolvable = EventEntity<keyof ClientEvents> | CommandEntity | HookEntity

export type EnvironmentType = 'yaml' | 'yml' | 'json'