import { Client, ClientEvents } from 'discord.js'
import { CommandAlias } from './type/Container'
import Constructable from './Constructable'

export default class Container<K extends keyof ClientEvents> {
  public client: Client = new Client()
  public events: Array<Constructable<K>> = []
  public middlewares: Array<Constructable<any>> = []
  public hooks: Array<Constructable<any>> = []
  public commands: Array<Constructable<any>> = []
  public commandAlias: CommandAlias = {}
}