import { fetchSortedExpression } from 'fs-recursive'
import Environment from './Environment'
import { EnvironmentType } from './types'
import YAML from 'js-yaml'

export default class EnvironmentBuilder {
  public environment: Environment | undefined

  public async fetch () {
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
}