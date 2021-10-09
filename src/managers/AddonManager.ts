import { BaseAddon } from '../entities/Addon'
import Ignitor from '../Ignitor'
import { EventEntity } from '../entities/Event'
import { CommandEntity } from '../entities/Command'
import { HookEntity } from '../entities/Hook'
import NodeEmitter from '../utils/NodeEmitter'
import { BaseCli } from '../entities/Cli'

export default class AddonManager {
  constructor (public ignitor: Ignitor) {
  }

  public async registerAddons (): Promise<void> {
    const addons: Function[] = await this.ignitor.kernel.registerAddons()
      await Promise.all(
        addons.map(async (item: any) => {
        const addonContext = { ...this.ignitor }

        const addon: BaseAddon<any> = await new item(this.ignitor).init()
        addonContext['addon'] = addon

        const addonSectionName = addon.addonName.toUpperCase()

        const keys = addon.defineKeys()
        keys.forEach((key: string) => {
          if (!this.ignitor.getEnvironment(`${addonSectionName}.${key}`)) {
            throw new Error(`The "${key}" key is required in the "${addon.addonName.toUpperCase()}" module environment.`)
          }
        })

        const cli = addon.registerCLI()
        const registeredCliCommands = cli.map((item: any) => {
          const command = new item(addonContext)
          this.registerCLI(command as BaseCli<unknown>)
          return command
        })


        const events = addon.registerEvents()
        const registeredEvents = events.map((item: any) => {
          const event = new item(addonContext)
          this.registerEvent(event as EventEntity<any>)
        })

        const commands = addon.registerCommands()
        commands.forEach((item: any) => {
          const command = new item(addonContext)
          this.registerCommand(command as CommandEntity)
        })

        const hooks = addon.registerHooks()
        hooks.map(async (item: any) => {
          const hook = new item(addonContext)
          this.registerHooks(hook as HookEntity)
        })

        return {
          events: registeredEvents,
          cliCommands: registeredCliCommands
        }
      })
    )
  }

  private registerCLI (Class: BaseCli<unknown>) {
    // this.ignitor.container.cli.set(Class.prefix, Class)
    this.ignitor.cliManager.register(Class)
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