import EventManager from './managers/EventManager'
import { Client, Collection, OAuth2Guild, RateLimitData, ShardingManager, Snowflake } from 'discord.js'
import Ignitor from './Ignitor'
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
import BaseCommandManager from './managers/BaseCommandManager'

export default class Factory {
  private static $instance: Factory

  public client: Client | undefined
  public shardManager: ShardingManager | undefined
  public guildIds: Snowflake[] = []

  public readonly eventManager: EventManager = new EventManager(this)
  public readonly hookManager: HookManager = new HookManager(this)
  public readonly commandManager: BaseCommandManager = new BaseCommandManager(this)
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
    const guildCollection = await this.client?.guilds.fetch() as Collection<Snowflake, OAuth2Guild>
    this.guildIds = guildCollection.map((guild: OAuth2Guild) => guild.id)

    this.client?.on('rateLimit', (rateLimit: RateLimitData) => {
      Logger.send('info', `The application has been rate limited, please try again in ${rateLimit.timeout / 1000} seconds`)
      Logger.send('info', `method: ${rateLimit.method} | path: ${rateLimit.path}`)
    })

    // this.client?.on('guildCreate', async (guild: Guild) => {
    //   this.guildIds.push(guild.id)
    //   // this.commandManager.add(guild.id)
    //   // await this.contextMenuManager.add()
    // })
    //
    // this.client?.on('guildDelete', async (guild: Guild) => {
    //   const index = this.guildIds.findIndex((id: Snowflake) => id === guild.id)
    //   this.guildIds.splice(index, 1)
    //   this.commandManager.remove(guild.id)
    //   // await this.contextMenuManager.remove(guild.id)
    // })

    await this.ignitor.addonManager.registerAddons()
    await this.hookManager.register()

    await Promise.all([
      this.eventManager.register(),
      this.commandManager.setup(),
      this.discordEventManager.register(
        new VoiceMemberJoin(this),
        new VoiceMemberLeave(this),
        new GuildMemberAddBoost(this),
        new GuildMemberRemoveBoost(this),
      ),
    ])

    this.ignitor.container.providers.forEach((provider: ProviderEntity) => provider.ok())
    NodeEmitter.emit('application::ok', this.client)
    return this
  }
}