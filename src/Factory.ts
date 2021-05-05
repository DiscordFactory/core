import path from 'path'
import { fetch } from 'fs-recursive'
import Container from './Container'
import Dispatcher from './Dispatcher'

export default class Factory {
  private static $instance: Factory
  public $container = new Container()

  public static getInstance () {
    if (!Factory.$instance) {
      Factory.$instance = new Factory()
    }
    return this.$instance
  }
  
  public async init () {
    const root = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'build', 'src')
      : path.join(process.cwd(), 'src')

    const files = await fetch(root, ['ts'], 'utf-8')

    const dispatcher = new Dispatcher(files)
    await dispatcher.dispatch()

    await Factory.$instance.$container.client.login('Nzg1ODgxOTk1NDc2ODYwOTc5.X8-TpA.HmGojFwoZYEZza-wNcHYo1_Hw-4')
  }
}