import EventManager from './managers/EventManager'
import { Client, Collection, Guild, OAuth2Guild, RateLimitData, ShardingManager, Snowflake } from 'discord.js'
import Ignitor from './Ignitor'
import HookManager from './managers/HookManager'
import NodeEmitter from './utils/NodeEmitter'
import ProviderManager from './managers/ProviderManager'
import { ProviderEntity } from './entities/Provider'
import { DiscordEventManager } from './managers/DiscordEventManager'
import VoiceJoin from './events/VoiceJoin'
import VoiceLeave from './events/VoiceLeave'
import GuildMemberAddBoost from './events/GuildMemberAddBoost'
import GuildMemberRemoveBoost from './events/GuildMemberRemoveBoost'
import Logger from '@leadcodedev/logger'
import BaseCommandManager from './managers/BaseCommandManager'

export default class Factory {
  private static $instance: Factory

  public client: Client | undefined
  public shardManager: ShardingManager | undefined
  public guildIds: Snowflake[] = []

  public readonly eventManager: EventManager = new EventManager(this)
  public readonly hookManager: HookManager = new HookManager(this)
  public readonly baseCommandManager: BaseCommandManager = new BaseCommandManager(this)
  public readonly providerManager: ProviderManager = new ProviderManager(this)
  public readonly discordEventManager: DiscordEventManager = new DiscordEventManager(this)

  constructor (public ignitor: Ignitor) {
  }

  public async createClient () {
    const SHARDS = this.ignitor.environmentBuilder.environment!.content.SHARDS

    this.client = new Client({
      intents: this.ignitor.environmentBuilder.environment?.content.INTENTS,
      partials: this.ignitor.environmentBuilder.environment?.content.PARTIALS,
      ...SHARDS && SHARDS.MODE === 'AUTO' && { shards: 'auto' },
    })

    await this.client?.login(this.ignitor.environmentBuilder.environment?.content.APP_TOKEN)
    NodeEmitter.emit('application::client::login', this.client)

    
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
    const SHARDS = this.ignitor.environmentBuilder.environment!.content.SHARDS

    if (!SHARDS || SHARDS.MODE !== 'FILE') {
      await this.createClient()
    }

    await this.providerManager.register()
    this.ignitor.container.providers.forEach((provider: ProviderEntity) => provider.boot())
    const guildCollection = await this.client?.guilds.fetch() as Collection<Snowflake, OAuth2Guild>
    this.guildIds = guildCollection.map((guild: OAuth2Guild) => guild.id)

    this.client?.on('rateLimit', (rateLimit: RateLimitData) => {
      Logger.send('info', `The application has been rate limited, please try again in ${rateLimit.timeout / 1000} seconds`)
      Logger.send('info', `method: ${rateLimit.method} | path: ${rateLimit.path}`)
    })

    this.client?.on('guildCreate', async (guild: Guild) => {
      this.guildIds.push(guild.id)
      await this.baseCommandManager.add(guild)
    })

    this.client?.on('guildDelete', async (guild: Guild) => {
      const index = this.guildIds.findIndex((id: Snowflake) => id === guild.id)
      this.guildIds.splice(index, 1)
    })

    await this.ignitor.addonManager.registerAddons()
    await this.hookManager.register()

    await Promise.all([
      this.eventManager.register(),
      this.baseCommandManager.setup(),
      this.discordEventManager.register(
        new VoiceLeave(this),
        new VoiceJoin(this),
        new GuildMemberAddBoost(this),
        new GuildMemberRemoveBoost(this),
      ),
    ])

    this.ignitor.container.providers.forEach((provider: ProviderEntity) => provider.ok())
    NodeEmitter.emit('application::ok', this.client)
    return this
  }
}