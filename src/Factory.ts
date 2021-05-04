import path from 'path'
import { fetch } from 'fs-recursive'
import Container from './container'
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
    // const root = path.join(process.cwd(), 'build', 'src')
    const root = 'E:\\WindowsData\\Bureau\\HelpMC\\discord-bot-helpmc\\build\\src\\'
    const files = await fetch(root, ['js'], 'utf-8')

    const dispatcher = new Dispatcher(files)
    await dispatcher.dispatch()
  }
}