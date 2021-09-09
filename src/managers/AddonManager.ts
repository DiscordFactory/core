import { AddonCommand, BaseAddonCommand, BaseAddon } from '../entities/Addon'
import Ignitor from '../Ignitor'
import { BaseEvent, EventEntity } from '../entities/Event'
import { BaseCommand, CommandEntity } from '../entities/Command'
import { BaseHook, HookEntity } from '../entities/Hook'
import NodeEmitter from '../utils/NodeEmitter'

export default class AddonManager {
  constructor (public ignitor: Ignitor) {
  }

  public async registerAddons () {
    const addons: Function[] = await this.ignitor.kernel.registerAddons()

    addons.forEach((item: Function) => {
      const addon: BaseAddon = item()

      const cli = addon.registerCLI()
      cli.forEach((command: BaseAddonCommand) => {
        this.registerCLI(command as AddonCommand)
      })

      const events = addon.registerEvents()
      events.forEach((event: BaseEvent) => {
        this.registerEvent(event as EventEntity<any>)
      })

      const commands = addon.registerCommands()
      commands.forEach((command: BaseCommand) => {
        this.registerCommand(command as CommandEntity)
      })

      const hooks = addon.registerHooks()
      hooks.forEach((hook: BaseHook) => {
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