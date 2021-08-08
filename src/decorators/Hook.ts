import HookEntity from '../entities/HookEntity'
import { HookType } from '../types/Hook'

export default function Hook (hook: HookType) {
  return (target: Function) => {
    return class Hook extends HookEntity {
      constructor () {
        super(hook, target.prototype.run)
      }
    }
  }
}