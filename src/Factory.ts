import EventManager from './managers/EventManager'
import { Client, Collection } from 'discord.js'
import AddonManager from './managers/AddonManager'
import Ignitor from './Ignitor'

export default class Factory {
  public client: Client | undefined

  public readonly eventManager: EventManager = new EventManager(this)

  constructor (public ignitor: Ignitor) {
    this.client = new Client({
      intents: ['GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES'],
      partials: ['MESSAGE', 'REACTION', 'CHANNEL']
    })
  }

  public async init () {
    await this.client?.login('Nzg1ODgxOTk1NDc2ODYwOTc5.X8-TpA.cYGqnporjwOBgpalYIs7vQ7sCOo')
    await this.ignitor.addonManager.registerAddons()
    await this.eventManager.register()
    return this
  }

  public async registerEvents () {
  }
}