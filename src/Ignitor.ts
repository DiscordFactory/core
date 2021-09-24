import Factory from './Factory'
import { fetch, fetchSortedExpression } from 'fs-recursive'
import { Collection } from 'discord.js'
import AddonManager from './managers/AddonManager'
import Container from './Container'
import path from 'path'
import ModuleAlias from 'module-alias'
import NodeEmitter from './utils/NodeEmitter'
import YAML from 'js-yaml'
import Environment from './Environment'
import { EnvironmentType } from './types'

export default class Ignitor {
  public files: Collection<string, any> = new Collection()
  public factory: Factory | undefined
  public kernel: any | undefined
  public environment: Environment | undefined

  public readonly container: Container = new Container()
  public readonly addonManager: AddonManager = new AddonManager(this)

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
    const { cliCommands } = await this.addonManager.registerAddons()

    return cliCommands
  }

  private async getEnvironnement () {
    const environments = await fetchSortedExpression(
      process.cwd(),
      process.env.NODE_ENV === 'production'
        ? /^environment\.prod\.(json|yml|yaml)/
        : /^environment\.dev\.(json|yml|yaml)/,
      ['json', 'yml', 'yaml'],
      'utf-8',
      ['node_modules']
    )

    if (!environments.length) {
      throw new Error(`${process.env.NODE_ENV === 'production'
        ? 'environment.prod.(json|yml|yaml)'
        : 'environment.dev.(json|yml|yaml)'
      } file is missing, please create one in the root project.`)
    }

    const environment = environments[0]
    let environmentContent = {}

    if (environment.extension === 'json') {
      const file = await environment.getContent('utf-8')
      environmentContent = JSON.parse(file!.toString())
    }

    if (environment.extension === 'yaml' || environment.extension === 'yml') {
      const file = await environment.getContent('utf-8')
      environmentContent = YAML.load(file, 'utf8')
    }

    this.environment = new Environment(
      environment.extension as EnvironmentType,
      environmentContent
    )
  }

  private async loadFiles (dir) {
    const baseDir = path.join(process.cwd(), dir)
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
    const kernelPath = path.join(process.cwd(), 'start', 'Kernel.ts')
    const item = await import(kernelPath)
    this.kernel = new item.default()
  }

  private registerAlias () {
    ModuleAlias.addAlias('ioc:factory/Core', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
    ModuleAlias.addAlias('ioc:factory/Core/Provider', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
    ModuleAlias.addAlias('ioc:factory/Core/Event', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
    ModuleAlias.addAlias('ioc:factory/Core/Command', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
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
      let result = this.environment?.content
      pathChain.forEach(element => result = result?.[element])
      return result
    }
    else return this.environment?.content[key]
  }

  public getContainer (): Container {
    return this.container
  }

  public getFiles (): Collection<string, unknown> {
    return this.files
  }

  public getSelectEnvironment (): EnvironmentType {
    return this.environment!.type
  }
}