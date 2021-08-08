import YAML from 'js-yaml'
import { config } from 'dotenv'
import { fetch } from 'fs-recursive'
import { EnvironmentFactory } from '../types/Factory'

config()

export default class EnvironmentManager {
  public $env: EnvironmentFactory = {
    type: '',
    path: '',
    content: '',
  }
  
  public async load () {
    const environment = await fetch(process.cwd(),
      ['env', 'json', 'yaml', 'yml'],
      'utf-8',
      ['node_modules'])

    const environments = Array.from(environment.entries())
      .filter(([_, file]) => file.filename === 'environment' || file.extension === 'env')
      .map(([_, file]) => file)

    const env = environments.find(file => file.extension === 'env')
    if (env) {
      return this.$env = {
        type: env.extension,
        path: env.path,
        content: '',
      }
    }

    const json = environments.find(file => file.extension === 'json')
    if (json) {
      const content = await json.getContent('utf-8')
      return this.$env = {
        type: json.extension,
        path: json.path,
        content: content!.toString(),
      }
    }

    const yaml = environments.find(file => file.extension === 'yaml' || file.extension === 'yml')
    if (yaml) {
      const content = await yaml.getContent('utf-8')
      return this.$env = {
        type: yaml.extension,
        path: yaml.path,
        content: content!.toString(),
      }
    }

    throw new Error('Environment file is missing, please create one.')
  }

  public get (key: string) {
    const environments = {
      env: () => this.getFromEnv(key),
      json: () => this.getFromJSON(key),
      yaml: () => this.getFromYAML(key),
      yml: () => this.getFromYAML(key),
    }
    return environments[this.$env.type]()
  }

  private filterEnvironment (identifier) {
    return Object.entries(process.env)
      .map(([key, value]) => key.toLowerCase().startsWith(identifier) ? { [key.replace(`${identifier.toUpperCase()}_`, '')]: value } : null)
      .filter(rule => rule).reduce((acc, t) => ({ ...acc, ...t }))
  }

  private getFromEnv (key: string) {
    const messages = this.filterEnvironment('message')
    const presets = this.filterEnvironment('preset')
    const partials = Object.entries(process.env)
      .flatMap(([key, value]: any) => {
        return key.toLowerCase().startsWith('partial') ? { [key]: value } : null
      })
      .filter(preset => preset)
      .flatMap((preset: any) => {
        return Object.entries(preset).flatMap((item) => {
          return item[1] === 'true' && item[0].replace('PARTIAL_', '')
        }).filter(item => item)
      }) as Array<string>

    const env = {
      APP_TOKEN: process.env.APP_TOKEN,
      APP_PREFIX: process.env.APP_PREFIX,
      PARTIALS: partials,
      MESSAGES: messages,
      PRESETS: presets,
    }

    return env[key]
  }

  private getFromJSON (key: string) {
    return JSON.parse(this.$env.content)[key]
  }

  private getFromYAML (key: string) {
    const env = YAML.load(this.$env.content)
    return env[key]
  }
}