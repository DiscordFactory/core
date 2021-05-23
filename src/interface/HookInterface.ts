import { Hooks } from '../type/Hooks'
import CommandContext from '../contexts/CommandContext'

export interface BaseHook {
  run(context: CommandContext): Promise<void>
}
export interface HookInterface extends BaseHook {
  hook: Hooks
}