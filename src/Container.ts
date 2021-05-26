import { Client, ClientEvents } from 'discord.js'
import { CommandAlias } from './type/Container'
import Constructable from './Constructable'
import Provider from './interface/ProviderInterface'

export class Container<K extends keyof ClientEvents> {
  constructor (public client: Client) {
  }

  public events: Array<Constructable<K>> = []
  public middlewares: Array<Constructable<any>> = []
  public hooks: Array<Constructable<any>> = []
  public commands: Array<Constructable<any>> = []
  public commandAlias: CommandAlias = {}
  public providers: Array<Provider> = []
}