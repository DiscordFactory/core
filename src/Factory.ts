import EventManager from './managers/EventManager'
import { Client, RateLimitData, ShardingManager } from 'discord.js'
import Ignitor from './Ignitor'
import CommandManager from './managers/CommandManager'
import HookManager from './managers/HookManager'
import NodeEmitter from './utils/NodeEmitter'
import ProviderManager from './managers/ProviderManager'
import { ProviderEntity } from './entities/Provider'
import { DiscordEventManager } from './managers/DiscordEventManager'
import VoiceMemberJoin from './events/VoiceMemberJoin'
import VoiceMemberLeave from './events/VoiceMemberLeave'
import GuildMemberAddBoost from './events/GuildMemberAddBoost'
import GuildMemberRemoveBoost from './events/GuildMemberRemoveBoost'
import Logger from '@leadcodedev/logger'
import ContextMenuManager from './managers/ContextMenuManager'

export default class Factory {
  private static $instance: Factory

  public client: Client | undefined
  public shardManager: ShardingManager | undefined

  public readonly eventManager: EventManager = new EventManager(this)
  public readonly commandManager: CommandManager = new CommandManager(this)
  public readonly contextMenuManager: ContextMenuManager = new ContextMenuManager(this)
  public readonly hookManager: HookManager = new HookManager(this)
  public readonly providerManager: ProviderManager = new ProviderManager(this)
  public readonly discordEventManager: DiscordEventManager = new DiscordEventManager(this)

  constructor (public ignitor: Ignitor) {
  }

  public async createClient () {
    const SHARDS = this.ignitor.environmentBuilder.environment!.content.SHARDS

    this.client = new Client({
      intents: this.ignitor.environmentBuilder.environment?.content.INTENTS,
      partials: this.ignitor.environmentBuilder.environment?.content.PARTIALS,
      ...SHARDS && SHARDS.MODE === 'AUTO' && { shards: 'auto' }
    })

    await this.client?.login(this.ignitor.environmentBuilder.environment?.content.APP_TOKEN)
    NodeEmitter.emit('application::client::login')
  }

  // public async createShards () {
  //   const environment = this.ignitor.environmentBuilder.environment!.content
  //   const TOKEN = environment.APP_TOKEN
  //   const SHARDS = environment.SHARDS
  //
  //   const manager = new ShardingManager(path.join(__dirname, 'DiscordClient.js'), {
  //     token: TOKEN,
  //     respawn: SHARDS.RESPAWN || true
  //   })
  //   await manager.spawn()
  //
  //   this.shardManager = manager
  // }

  public static getInstance (ignitor?: Ignitor) {
    if (!this.$instance) {
      if (ignitor) {
        this.$instance = new Factory(ignitor)
      }
    }
    return this.$instance
  }

  public async init () {
    const SHARDS = this.ignitor.environmentBuilder.environment!.content.SHARDS

    if (!SHARDS || SHARDS.MODE !== 'FILE') {
      await this.createClient()
    }

    await this.providerManager.register()
    this.ignitor.container.providers.forEach((provider: ProviderEntity) => provider.boot())

    this.client?.on('rateLimit', (rateLimit: RateLimitData) => {
      Logger.send('info', `The application has been rate limited, please try again in ${rateLimit.timeout / 1000} seconds`)
    })

    await this.ignitor.addonManager.registerAddons()

    await this.discordEventManager.register(
      new VoiceMemberJoin(this),
      new VoiceMemberLeave(this),
      new GuildMemberAddBoost(this),
      new GuildMemberRemoveBoost(this),
    )

    await this.hookManager.register()
    await this.eventManager.register()
    await this.commandManager.register()
    await this.contextMenuManager.register()


    this.ignitor.container.providers.forEach((provider: ProviderEntity) => provider.ok())
    NodeEmitter.emit('application::ok', this.client)
    return this
  }
}