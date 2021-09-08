import EventManager from './managers/EventManager'
import { Client } from 'discord.js'
import Ignitor from './Ignitor'
import CommandManager from './managers/CommandManager'

export default class Factory {
  public client: Client | undefined

  public readonly eventManager: EventManager = new EventManager(this)
  public readonly commandManager: CommandManager = new CommandManager(this)

  constructor (public ignitor: Ignitor) {
    this.client = new Client({
      intents: ['GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES'],
      partials: ['MESSAGE', 'REACTION', 'CHANNEL']
    })
  }

  public async init () {
    await this.client?.login('Nzg1ODgxOTk1NDc2ODYwOTc5.X8-TpA.B60iiI3uKRVTDLc2JJPBDhUSwQ4')

    await this.ignitor.addonManager.registerAddons()

    await this.eventManager.register()
    await this.commandManager.register()

    return this
  }
}