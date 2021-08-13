import YAML from 'js-yaml'
import { config } from 'dotenv'
import { fetchSortedExpression, File } from 'fs-recursive'
import { EnvironmentFactory, Environment, EnvironmentElement } from 'types/Factory'

config()

export default class EnvironmentManager {
  public $env: Environment = {
    type: '',
    path: '',
    content: {},
  }

	public async load() {
		const environment = await fetchSortedExpression(process.cwd(), /^environment\.(json|yml|yaml)|\.env$/, ['env', 'json', 'yml', 'yaml'], 'utf-8', ['node_modules'])
		
		if (!environment.length) throw new Error('Environment file is missing, please create one.')
		
		const types: EnvironmentFactory = {
			env: this.getFromEnv,
			json: this.getFromJSON,
			yml: this.getFromYAML,
			yaml: this.getFromYAML
		}
		const file = environment[0]
		const factory = types[file.extension]

		if (!factory) throw new Error(`Factory not found for file: ${file.path}`)

		return this.$env = {
    	type: file.extension,
    	path: file.path,
			content: await factory(file)
    }
	}

	private filterEnvironment (identifier: string) {
		return Object.entries(process.env)
			.filter(([key]) => key.toLowerCase().startsWith(identifier))
			.map(([key, value]) => ({ [key.replace(`${identifier.toUpperCase()}_`, '')]: value! }))
			.reduce((acc, t) => ({ ...acc, ...t }))
  }

	private async getFromEnv(_file: File): Promise<EnvironmentElement> {
   	const messages = this.filterEnvironment('message')
    const presets = this.filterEnvironment('preset')
    const partials = Object.keys(Object.entries(process.env)
			.filter(([key]) => key.toLowerCase().startsWith('partial'))
			.filter(([_, value]) => value === 'true')
			.map(([key, value]) => ({ [key]: value }))
			.keys())

    return {
      APP_TOKEN: process.env.APP_TOKEN!,
      APP_PREFIX: process.env.APP_PREFIX!,
      PARTIALS: partials,
      MESSAGES: messages,
      PRESETS: presets,
    }
	}

	private async getFromJSON(file: File) {
		const content = await file.getContent('utf-8')

		return JSON.parse(content!.toString())
	}

	private async getFromYAML(file: File) {
		const content = await file.getContent('utf-8')

		return YAML.load(content!.toString())
	}

	public get(key: string) {
		return this.$env.content[key]
	}
}