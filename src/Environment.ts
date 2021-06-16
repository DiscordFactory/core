import YAML from 'js-yaml'
import { config } from 'dotenv'
import { EnvironmentFactory } from './type/Factory'
import Factory from './Factory'

config()

export default class Environment {
  public static $instance: Environment
  public env: EnvironmentFactory = Factory.getInstance().$env

  public static get (key: string) {
    if (!this.$instance) {
      this.$instance = new Environment()
    }

    const environments = {
      env: () => this.$instance.getFromEnv(key),
      json: () => this.$instance.getFromJSON(key),
      yaml: () => this.$instance.getFromYAML(key),
      yml: () => this.$instance.getFromYAML(key),
    }
    return environments[this.$instance.env.type]()
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
    return JSON.parse(this.env.content)[key]
  }

  private getFromYAML (key: string) {
    const env = YAML.load(this.env.content)
    return env[key]
  }
}