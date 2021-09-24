import Factory from '../Factory'

export default class VoiceMemberJoin {
  constructor (public factory: Factory) {
  }
  public async handle () {
    this.factory.client?.ws.on('VOICE_STATE_UPDATE', (payload) => {
      if (!payload.channel_id) {
        return
      }

      const guild = this.factory!.client!.guilds.cache.get(payload.guild_id)
      const member = guild?.members.cache.get(payload.member.user.id)

      this.factory?.client?.emit('voiceMemberJoin', member, member?.voice.channel)
    })
  }
}