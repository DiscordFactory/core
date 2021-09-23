import Factory from '../Factory'

export default class VoiceMemberJoin {
  constructor (public factory: Factory) {
  }

  public async handle (payload: any): Promise<void> {
    this.factory.client?.emit('websocketDebug', payload)
  }
}