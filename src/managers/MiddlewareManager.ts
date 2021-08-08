import Factory from '../Factory'
import { QueueItem } from '../types'
import { activeProvider } from '../helpers/Provider'
import MiddlewareEntity from '../entities/MiddlewareEntity'
import Manager from './Manager'

export default class MiddlewareManager extends Manager {
  public async register (item: QueueItem) {
    const $container = Factory.getInstance().$container
    
    const instance = new item.default()
    const middleware = new MiddlewareEntity(instance.basePattern, instance.run, item.file)
    
    $container?.middlewares.push(middleware)

    await this.activeProvider(middleware)
  }

  public async activeProvider (middlewareManager: MiddlewareEntity) {
    await activeProvider(
      Factory.getInstance().$container!,
      middlewareManager,
    )
  }
}