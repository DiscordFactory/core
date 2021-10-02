import Factory from '../Factory'

export default class VoiceLeave {
  constructor (public factory: Factory) {
  }

  public async handle () {
    this.factory.client?.on('raw', ({ t: event, d: payload }) => {
      if (event !== 'VOICE_STATE_UPDATE') {
        return
      }

      const guild = this.factory.client?.guilds.resolve(payload.guild_id)!
      const oldMember = guild.members.cache.get(payload.member.user.id)

      if (!oldMember?.voice.channel || oldMember?.voice.channel?.id === payload.channel_id) {
        return
      }

      const member = guild.members.resolve(payload.member.user.id)

      this.factory?.client?.emit('voiceLeave', {
        ...member.voice,
        channelId: payload.channel_id,
        channel: oldMember?.voice.channel,
        member,
      })
    })
  }
}