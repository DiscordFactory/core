import { Hooks } from '../type/Hooks'

export default interface BaseHook {
  run(...args: any): Promise<void>
}
export interface HookInterface extends BaseHook {
  hook: Hooks
}