import CommandContext from '../contexts/CommandContext'

export type HookType = 'app:command:preload' | 'app:command:cancelled' | 'app:command:executed' | 'app:message:received'

export interface BaseHook {
  run (context: CommandContext): Promise<void>
}

export interface HookInterface extends BaseHook {
  hook: HookType
}