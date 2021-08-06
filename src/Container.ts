import { Client, ClientEvents } from 'discord.js'
import { CommandAlias } from './type/Container'
import Provider from './interface/ProviderInterface'
import CommandEntity from './entities/CommandEntity'
import EventEntity from './entities/EventEntity'
import MiddlewareEntity from './entities/MiddlewareEntity'
import HookEntity from './entities/HookEntity'
import SlashCommandEntity from './entities/SlashCommandEntity'

export class Container {
  public events: Array<EventEntity<keyof ClientEvents>> = []
  public slashCommands: Array<SlashCommandEntity> = []
  public middlewares: Array<MiddlewareEntity> = []
  public hooks: Array<HookEntity> = []
  public commands: Array<CommandEntity> = []
  public commandAlias: CommandAlias = {}
  public providers: Array<Provider> = []

  constructor (public client: Client) {
  }
}