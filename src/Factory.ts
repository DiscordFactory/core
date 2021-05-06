import path from 'path'
import Env from '@discord-factory/env'
import { fetch } from 'fs-recursive'
import Container from './Container'
import Dispatcher from './Dispatcher'
import Guard from './Guard'

export default class Factory {
  private static $instance: Factory
  public $container = new Container()

  public static getInstance () {
    if (!Factory.$instance) {
      Factory.$instance = new Factory()
    }
    return this.$instance
  }
  
  public async setup () {
    const root = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'build', 'src')
      : path.join(process.cwd(), 'src')

    const files = await fetch(root,
      [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
      'utf-8')

    const dispatcher = new Dispatcher(files)
    await dispatcher.dispatch()

    await this.$container.client.login(Env.get('TOKEN'))

    const guard = new Guard()

    this.$container.client.on('message', async (message) => {
      await guard.protect(message)
    })
  }
}