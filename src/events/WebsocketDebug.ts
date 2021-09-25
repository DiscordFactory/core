import Factory from '../Factory'

export default class WebsocketDebug {
  constructor (public factory: Factory) {
  }

  public async handle (): Promise<void> {
    this.factory.client?.on('raw', (payload: any) => {
      this.factory.client?.emit('websocketDebug', payload)
    })
  }
}