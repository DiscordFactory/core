import {
  ApplicationCommandOption,
  Client,
  ClientEvents,
  Collection,
  GuildMember, StageChannel, VoiceChannel
} from 'discord.js'
import { EventEntity } from '../entities/Event'
import { File } from 'fs-recursive'
import { CommandEntity } from '../entities/Command'
import { HookEntity } from '../entities/Hook'
import { ProviderEntity } from '../entities/Provider'
import Container from '../Container'

export type ContainerType = 'event' | 'command' | 'hook' | 'middleware'

export type HookType = 'application::starting'
  | 'application::ok'
  | 'application::client::login'
  | 'application::commands::registered'
  | 'application::events::registered'
  | 'application::hooks::registered'

export type Constructable<K extends keyof Events> = {
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
  cooldown?: Cooldown,
  options: SlashOption
}

export type CommandContainer = CommandEntity[]

export type EventContainer = EventEntity<any>[]

export type HookContainer = HookEntity[]

export type ProviderContainer = ProviderEntity[]

export type EntityResolvable = EventEntity<keyof ClientEvents> | CommandEntity | HookEntity

export type EnvironmentType = 'yaml' | 'yml' | 'json'

export interface AddonContext<Addon> {
  addon: Addon
  client: Client
  getModuleEnvironment (module: string, key: string): string
  getSelectEnvironment (): EnvironmentType
  getEnvironment (key: string): unknown | undefined
  getContainer (): Container
  getFiles (): Collection<string, unknown>
}

export type Cooldown = {
  time?: number
  count?: number
  message?: string | null
}

export interface Events extends ClientEvents {
  guildMemberAddBoost: [member: GuildMember]
  guildMemberRemoveBoost: [member: GuildMember]
  voiceMemberJoin: [member: GuildMember, channel: VoiceChannel | StageChannel]
  voiceMemberLeave: [member: GuildMember, channel: VoiceChannel | StageChannel]
  websocketDebug: [payload: any]
}

export type CooldownActions = {
  timeout: any,
  count: number
}