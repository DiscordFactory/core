import Factory from '../Factory'

export default class GuildMemberAddBoost {
  constructor (public factory: Factory) {
  }

  public async handle () {
    this.factory.client?.ws.on('GUILD_MEMBER_UPDATE', (payload) => {
      const guild = this.factory.client?.guilds.cache.get(payload.guild_id)
      const member = guild?.members.cache.get(payload.user.id)

      if (!payload.premium_since) {
        return
      }

      if (member!.premiumSince! < new Date(payload.premium_since)) {
        this.factory.client?.emit('guildMemberAddBoost', member)
      }
    })
  }
}