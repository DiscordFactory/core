import { ApplicationCommandOption, CommandInteraction } from 'discord.js'

export type ScopeContext = 'GLOBAL' | string

export type SlashContext = {
  name: string
  description: string
  options: ApplicationCommandOption[]
}

export interface BaseSlashCommand {
  run (interaction: CommandInteraction): Promise<void>
}