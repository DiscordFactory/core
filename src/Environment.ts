import { EnvironmentType } from './types'

export default class Environment {
  constructor (
    public type: EnvironmentType,
    public content: { [K in string]: any }
  ) {
  }
}