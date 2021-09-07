import { AddonCommand, BaseAddonCommand, BaseAddon } from '../entities/Addon'
import Ignitor from '../Ignitor'
import { BaseEvent, EventEntity } from '../entities/Event'

export default class AddonManager {
  constructor (public ignitor: Ignitor) {
  }

  public async registerAddons () {
    const addons: Function[] = await this.ignitor.kernel.registerAddons()

    addons.forEach((item: Function) => {
      const addon: BaseAddon = item()

      const commands = addon.registerCLI()
      commands.forEach((command: BaseAddonCommand) => {
        this.registerCLI(command as AddonCommand)
      })

      const events = addon.registerEvents()
      events.forEach((event: BaseEvent) => {
        this.registerEvent(event as EventEntity<any>)
      })
    })
  }

  private registerCLI (Class: AddonCommand) {
    this.ignitor.container.cli.set(Class.prefix, Class)
  }

  private registerEvent (Class: EventEntity<any>) {
    this.ignitor.container.events.push(Class)
    this.ignitor.factory?.client?.on(
      Class.event,
      async (...args) => await Class.run(...args)
    )
  }
}