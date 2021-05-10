import { Hooks } from '../type/Hooks'

export interface BaseHook {
  run(...args: any): Promise<void>
}
export interface HookInterface extends BaseHook {
  hook: Hooks
}