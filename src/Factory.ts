import EventManager from './managers/EventManager'
import { Client } from 'discord.js'
import Ignitor from './Ignitor'
import CommandManager from './managers/CommandManager'
import HookManager from './managers/HookManager'
import NodeEmitter from './utils/NodeEmitter'
import ProviderManager from './managers/ProviderManager'

export default class Factory {
  public client: Client | undefined

  public readonly eventManager: EventManager = new EventManager(this)
  public readonly commandManager: CommandManager = new CommandManager(this)
  public readonly hookManager: HookManager = new HookManager(this)
  public readonly providerManager: ProviderManager = new ProviderManager(this)

  constructor (public ignitor: Ignitor) {
    this.client = new Client({
      intents: ['GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES'],
      partials: ['MESSAGE', 'REACTION', 'CHANNEL']
    })
  }

  public async init () {
    await this.client?.login('Nzg1ODgxOTk1NDc2ODYwOTc5.X8-TpA.B60iiI3uKRVTDLc2JJPBDhUSwQ4')
    NodeEmitter.emit('application::client::login')

    await this.providerManager.register()

    await this.ignitor.addonManager.registerAddons()

    await this.hookManager.register()
    await this.eventManager.register()
    await this.commandManager.register()

    NodeEmitter.emit('application::ok', this.client)
    return this
  }
}