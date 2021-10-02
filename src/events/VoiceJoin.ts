import Factory from '../Factory'

export default class VoiceJoin {
  constructor (public factory: Factory) {
  }
  public async handle () {
    this.factory.client?.on('raw', ({ t: event, d: payload }) => {
      if (event !== 'VOICE_STATE_UPDATE' || !payload.channel_id) {
        return
      }

      const guild = this.factory!.client!.guilds.resolve(payload.guild_id)
      const member = guild?.members.resolve(payload.user_id)

      this.factory?.client?.emit('voiceJoin', {
        ...member.voice,
        channelId: payload.channel_id,
        channel: guild.channels.resolve(payload.channel_id),
        member,
      })
    })
  }
}