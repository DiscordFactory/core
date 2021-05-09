import { Hooks } from './type/Hooks'
import { HookInterface } from './interface/HookInterface'

type Listener = (...args: Array<any>) => Promise<void>
type ConstructableListener = {
  identifier: Hooks
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
  public async register(target: Hooks, ...args: Array<any>): Promise<void> {
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
   * @param hookEntity
   */
  public listen(hookEntity: HookInterface): void {
    const constructableListener = this.listeners.find((listener) => {
      return listener.identifier === hookEntity.hook
    })

    if (constructableListener) {
      constructableListener.listeners.push((...args: Array<any>) => {
        return hookEntity.run(args)
      })
      return
    }

    this.listeners.push({
      identifier: hookEntity.hook,
      listeners: [async (...args: Array<any>) => {
        await hookEntity.run(...args)
      }],
    })
  }
}

export default new NodeEmitter()