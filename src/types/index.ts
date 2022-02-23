import {
  ApplicationCommandOption, ApplicationCommandOptionData,
  ApplicationCommandPermissionData,
  ApplicationCommandPermissions,
  ApplicationCommandPermissionsManager,
  Client,
  ClientEvents,
  Collection,
  GuildMember,
  Snowflake,
  VoiceState
} from 'discord.js'
import { EventEntity } from '../entities/Event'
import { File } from 'fs-recursive'
import { CommandEntity } from '../entities/Command'
import { HookEntity } from '../entities/Hook'
import { ProviderEntity } from '../entities/Provider'
import Container from '../Container'
import { ContextMenuEntity } from '../entities/ContextMenu'
import { CAC } from 'cac'
import Ignitor from '../Ignitor'

export type ContainerType = 'event' | 'command' | 'hook' | 'middleware' | 'context-menu'

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

export type ScopeContext = 'GLOBAL' | 'GUILDS' | Snowflake[]

export type CommandContext = {
  name: string
  description: string
  options: ApplicationCommandOptionData[],
  defaultPermission?: boolean,
}

export type ApplicationContextOption = {
  name: string
  type: 'USER' | 'MESSAGE'
  defaultPermission?: boolean,
}

export type CommandGlobalContext = {
  scope: ScopeContext
  cooldown?: Cooldown,
  permissions?: ApplicationCommandPermissionData[]
  options: CommandContext
}

type NativeResolvable = { [K: string]: string | number | boolean | NativeResolvable }

export type CliContextRuntime = {
  options: NativeResolvable,
  args: NativeResolvable,
  cli: CAC,
  ignitor: Ignitor
}

export type CliOption = {
  name: string
  description: string
  config?: {
    default?: any,
    type?: any[]
  }
}

export type CliCommandContext = {
  prefix: string,
  description: string
  args?: string[],
  config?: {
    allowUnknownOptions?: boolean,
    ignoreOptionDefaultValue?: boolean
  }
  options?: CliOption[]
  alias?: string[],
  exemple?: string
}

export type ApplicationGlobalContext = {
  scope: ScopeContext
  cooldown?: Cooldown,
  permissions?: ApplicationCommandPermissionData[]
  options: ApplicationContextOption
}

export type CommandContainer = CommandEntity[]

export type EventContainer = EventEntity<any>[]

export type HookContainer = HookEntity[]

export type ProviderContainer = ProviderEntity[]

export type EntityResolvable = EventEntity<keyof ClientEvents> | CommandEntity | ContextMenuEntity | HookEntity

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
  voiceJoin: [state: VoiceState]
  voiceLeave: [state: VoiceState]
  websocketDebug: [payload: any]
}

export type CooldownActions = {
  timeout: any,
  count: number
}

export interface AddApplicationCommandPermissionsOptions {
  command: Snowflake
  permissions: {id: Snowflake, type: 'ROLE' | 'USER', permission: boolean }[]
}

export interface PermissionManagerResolvable extends ApplicationCommandPermissionsManager<any, any, any, any, any> {
  add (options: AddApplicationCommandPermissionsOptions): Promise<ApplicationCommandPermissions[]>
}