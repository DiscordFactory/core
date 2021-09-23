import EventManager from './managers/EventManager'
import { Client } from 'discord.js'
import Ignitor from './Ignitor'
import CommandManager from './managers/CommandManager'
import HookManager from './managers/HookManager'
import NodeEmitter from './utils/NodeEmitter'
import ProviderManager from './managers/ProviderManager'
import { ProviderEntity } from './entities/Provider'

export default class Factory {
  private static $instance: Factory

  public client: Client | undefined

  public readonly eventManager: EventManager = new EventManager(this)
  public readonly commandManager: CommandManager = new CommandManager(this)
  public readonly hookManager: HookManager = new HookManager(this)
  public readonly providerManager: ProviderManager = new ProviderManager(this)

  constructor (public ignitor: Ignitor) {
    this.client = new Client({
      intents: this.ignitor.environment?.content.INTENTS,
      partials: this.ignitor.environment?.content.PARTIALS
    })
  }

  public static getInstance (ignitor?: Ignitor) {
    if (!this.$instance) {
      if (ignitor) {
        this.$instance = new Factory(ignitor)
      }
    }
    return this.$instance
  }

  public async init () {
    await this.providerManager.register()
    this.ignitor.container.providers.forEach((provider: ProviderEntity) => provider.boot())

    await this.client?.login(this.ignitor.environment?.content.APP_TOKEN)
    NodeEmitter.emit('application::client::login')

    await this.ignitor.addonManager.registerAddons()

    await this.hookManager.register()
    await this.eventManager.register()
    await this.commandManager.register()

    this.ignitor.container.providers.forEach((provider: ProviderEntity) => provider.ok())
    NodeEmitter.emit('application::ok', this.client)
    return this
  }
}