import Factory from '../Factory'

export class DiscordEventManager {
  constructor (public factory: Factory) {
  }

  public async register (...events: any[]) {
    await Promise.all(
      events.map(async (event) => {
        await event.handle()
      })
    )
  }
}