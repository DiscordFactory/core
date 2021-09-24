import Factory from '../Factory'

export default class VoiceMemberLeave {
  constructor (public factory: Factory) {
  }

  public async handle () {
    this.factory.client?.ws.on('VOICE_STATE_UPDATE', (payload) => {
      const guild = this.factory.client?.guilds.cache.get(payload.guild_id)
      const oldMember = guild?.members.cache.get(payload.member.user.id)

      if (!oldMember?.voice.channel || oldMember?.voice.channel?.id === payload.channel_id) {
        return
      }

      const member = guild?.members.cache.get(payload.member.user.id)

      this.factory.client?.emit('voiceMemberLeave', member, oldMember?.voice.channel)
    })
  }
}