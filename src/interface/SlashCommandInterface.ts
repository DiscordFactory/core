import { ApplicationCommandOption, CommandInteraction } from 'discord.js'

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

export interface BaseSlashCommand {
  run (interaction: CommandInteraction): Promise<void>
}