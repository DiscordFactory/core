import { AddonCommand, BaseAddon } from '../entities/Addon'
import Ignitor from '../Ignitor'
import { EventEntity } from '../entities/Event'
import { CommandEntity } from '../entities/Command'
import { HookEntity } from '../entities/Hook'
import NodeEmitter from '../utils/NodeEmitter'

export default class AddonManager {
  constructor (public ignitor: Ignitor) {
  }

  public async registerAddons () {
    const addons: Function[] = await this.ignitor.kernel.registerAddons()

    addons.forEach((item: Function) => {
      const addon: BaseAddon = item()

      addon.setFactory(this.ignitor.factory!)

      const environmentKeys = this.ignitor.environment?.content[addon.addonName.toUpperCase()]

      const keys = addon.defineKeys()
      keys.forEach((key: string) => {
        if (!environmentKeys[key]) {
          throw new Error(`The ${key} key is required in the ${addon.addonName} module environment.`)
        }
      })

      const cli = addon.registerCLI()
      cli.forEach((item: any) => {
        const command = new item(this.ignitor.factory)
        this.registerCLI(command as AddonCommand)
      })

      const events = addon.registerEvents()
      events.forEach((item: any) => {
        const event = new item(this.ignitor.factory)
        this.registerEvent(event as EventEntity<any>)
      })

      const commands = addon.registerCommands()
      commands.forEach((item: any) => {
        const command = new item(this.ignitor.factory)
        this.registerCommand(command as CommandEntity)
      })

      const hooks = addon.registerHooks()
      hooks.map(async (item: any) => {
        const hook = new item(this.ignitor.factory)
        this.registerHooks(hook as HookEntity)
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

  private registerCommand (Class: CommandEntity) {
    this.ignitor.container.commands.push(Class)
  }

  private registerHooks (Class: HookEntity) {
    NodeEmitter.on(Class.type, async (...props: any[]) => {
      await Class.run(...props)
    })
  }
}