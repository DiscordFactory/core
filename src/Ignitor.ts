import Factory from './Factory'
import { fetch } from 'fs-recursive'
import { Collection } from 'discord.js'
import AddonManager from './managers/AddonManager'
import Container from './Container'
import path from 'path'
import ModuleAlias from 'module-alias'
import NodeEmitter from './utils/NodeEmitter'
import { EnvironmentType } from './types'
import EnvironmentBuilder from './EnvironmentBuilder'
import CliManager from './managers/CliManager'
import Help from './cli/help'
import Version from './cli/version'
import { Command } from 'cac'

export default class Ignitor {
  public files: Collection<string, any> = new Collection()
  public factory: Factory | undefined
  public kernel: any | undefined
  public environmentBuilder: EnvironmentBuilder = new EnvironmentBuilder()

  public readonly container: Container = new Container()
  public readonly addonManager: AddonManager = new AddonManager(this)
  public readonly cliManager: CliManager = new CliManager(this)

  public async createFactory () {
    this.registerAlias()

    await this.getEnvironnement()
    await this.loadFiles('src')
    await this.loadFiles('providers')

    await this.loadKernel()

    this.factory = Factory.getInstance(this)
    await this.factory.init()

    NodeEmitter.emit('application::starting')

    return this
  }

  public async createCommand () {
    this.registerAlias()

    await this.getEnvironnement()
    await this.loadKernel()
    await this.addonManager.registerAddons()
    this.cliManager.register(
      new (Version as any)(),
      new (Help as any)(),
    )
    return this.cliManager.cli
  }

  private async getEnvironnement () {
    await this.environmentBuilder.fetch()
  }

  private async loadFiles (dir) {
    const baseDir = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'build', dir)
      : path.join(process.cwd(), dir)

    const fetchedFiles = await fetch(
      baseDir,
      [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
      'utf-8',
      ['node_modules', 'test']
    )

    const files = Array.from(fetchedFiles, ([key, file]) => ({ key, ...file }))
    await Promise.all(
      files.map(async (file) => {
        const res = await import(file.path)

        if (res?.default?.type) {
          this.files.set(file.key, {
            type: res.default.type,
            default: res.default,
            file,
          })
        }
      }))
  }

  private async loadKernel () {
    const kernelPath = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'build', 'start', 'Kernel.js')
      : path.join(process.cwd(), 'start', 'Kernel.ts')

    const item = await import(kernelPath)
    this.kernel = new item.default()
  }

  private registerAlias () {
    ModuleAlias.addAliases({
      App: process.env.NODE_ENV === 'production'
        ? path.join(process.cwd(), 'build', 'src')
        : path.join(process.cwd(), 'src'),
    })
    ModuleAlias.addAlias('ioc:factory/Core', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
    ModuleAlias.addAlias('ioc:factory/Core/Provider', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
    ModuleAlias.addAlias('ioc:factory/Core/Event', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
    ModuleAlias.addAlias('ioc:factory/Core/Command', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
    ModuleAlias.addAlias('ioc:factory/Core/ContextMenu', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
    ModuleAlias.addAlias('ioc:factory/Core/Hook', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
    ModuleAlias.addAlias('ioc:factory/Core/Container', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
  }

  public getModuleEnvironment (module: string, key: string) {
    const element = this.getEnvironment(module.toUpperCase())
    return element[key]
  }

  public getEnvironment (key: string): any | undefined {
    const pathChain = key.split('.')
    if (pathChain.length > 1) {
      let result = this.environmentBuilder.environment?.content
      pathChain.forEach(element => result = result?.[element])
      return result
    }
    else return this.environmentBuilder.environment?.content[key]
  }

  public getContainer (): Container {
    return this.container
  }

  public getFiles (): Collection<string, unknown> {
    return this.files
  }

  public getSelectEnvironment (): EnvironmentType {
    return this.environmentBuilder.environment!.type
  }

  public async exec () {
    const cli = await this.createCommand()
    const commands: Collection<string, Command> = new Collection()

    cli.commands.forEach((command) => {
      command.aliasNames.forEach((alias: string) => {
        commands.set(alias, command)
      })
    })

    if (!process.argv[2]) {
      process.argv[2] = 'help'
    }

    const command = cli.commands.find((command: Command) => command.aliasNames.includes(process.argv[2]))
    if (command) {
      process.argv[2] = command.name
    }

    cli.parse()
  }
}