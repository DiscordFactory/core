import EventManager from './managers/EventManager'
import { Client, Collection } from 'discord.js'
import Ignitor from './Ignitor'
import CommandManager from './managers/CommandManager'
import HookManager from './managers/HookManager'
import NodeEmitter from './utils/NodeEmitter'
import ProviderManager from './managers/ProviderManager'
import { ProviderEntity } from './entities/Provider'
import Container from './Container'
import { EnvironmentType } from './types'

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
    await this.providerManager.register()
    this.ignitor.container.providers.forEach((provider: ProviderEntity) => provider.boot())

    await this.client?.login('Nzg1ODgxOTk1NDc2ODYwOTc5.X8-TpA.B60iiI3uKRVTDLc2JJPBDhUSwQ4')
    NodeEmitter.emit('application::client::login')

    await this.ignitor.addonManager.registerAddons()

    await this.hookManager.register()
    await this.eventManager.register()
    await this.commandManager.register()

    this.ignitor.container.providers.forEach((provider: ProviderEntity) => provider.ok())
    NodeEmitter.emit('application::ok', this.client)
    return this
  }

  public getModuleEnvironment (module: string, key: string) {
    const element = this.getEnvironment(module.toUpperCase())
    return element[key]
  }

  public getEnvironment (key: string): any | undefined {
    return this.ignitor.environment?.content[key]
  }

  public getContainer (): Container {
    return this.ignitor.container
  }

  public getFiles (): Collection<string, unknown> {
    return this.ignitor.files
  }

  public getSelectEnvironment (): EnvironmentType {
    return this.ignitor.environment!.type
  }
}