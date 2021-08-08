import { Hook } from './types/Hook'
import HookEntity from './entities/HookEntity'

type Listener = (...args: Array<any>) => Promise<void>
type ConstructableListener = {
  identifier: Hook
  listeners: Array<Listener>
}

class NodeEmitter {
  private listeners: Array<ConstructableListener> = []

  /**
   * Records a new event that
   * can be listened to within the application.
   * @param target Hook
   * @param args ...args
   */
  public async register (target: Hook, ...args: Array<any>): Promise<void> {
    const listenerList = this.listeners.find((constructable) => {
      return constructable.identifier === target
    })

    if (listenerList) {
      await Promise.all(listenerList.listeners.map(async (listener) => {
        await listener(...args)
      }))
    }
  }

  /**
   * Activates the event listener
   * on the key passed in parameter.
   * @param entity
   */
  public listen (entity: HookEntity): void {
    const constructableListener = this.listeners.find((listener) => {
      return listener.identifier === entity.hook
    })

    if (constructableListener) {
      constructableListener.listeners.push((...args: Array<any>) => {
        return entity.run(...args)
      })
      return
    }

    this.listeners.push({
      identifier: entity.hook,
      listeners: [async (...args: Array<any>) => {
        await entity.run(...args)
      }],
    })
  }
}

export default new NodeEmitter()