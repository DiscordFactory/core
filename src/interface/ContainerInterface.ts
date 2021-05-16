import { Client, ClientEvents } from 'discord.js'
import Constructable from '../Constructable'
import { CommandAlias } from '../type/Container'

export interface Container<K extends keyof ClientEvents> {
  client: Client
  events: Array<Constructable<K>>
  middlewares: Array<Constructable<any>>
  hooks: Array<Constructable<any>>
  commands: Array<Constructable<any>>
  commandAlias: CommandAlias
}