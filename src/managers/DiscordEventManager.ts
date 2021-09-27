import Factory from '../Factory'

export class DiscordEventManager {
  constructor (public factory: Factory) {
  }

  public async register (...events: any[]) {
    events.map(async (event) => {
      await event.handle()
    })
  }
}