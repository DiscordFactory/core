import HookEntity from '../entities/HookEntity'
import { Hooks } from '../type/Hooks'

export default function Hook (hook: Hooks) {
  return (target: Function) => {
    return class Hook extends HookEntity {
      constructor () {
        super(hook, target.prototype.run)
      }
    }
  }
}