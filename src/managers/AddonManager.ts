import BaseAddon from '../addons/BaseAddon'
import { AddonCommand, BaseAddonCommand } from '../addons/AddonCommand'
import Ignitor from '../Ignitor'

export default class AddonManager {
  constructor (public ignitor: Ignitor) {
  }

  public async registerAddons () {
    const addons: Function[] = await this.ignitor.kernel.registerAddons()

    addons.forEach((item: Function) => {
      const addon: BaseAddon = item()
      const commands = addon.registerCLI()
      commands.forEach((command: BaseAddonCommand) => {
        this.registerCommand(command as AddonCommand)
      })
    })
  }

  private registerCommand (command: AddonCommand) {
    this.ignitor.container.cli.set(command.prefix, command)
  }
}