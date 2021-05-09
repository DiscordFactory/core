import { Hooks } from '../type/Hooks'

export default class HookEntity {
  public static type: string = 'hook'

  constructor(public hook: Hooks, public run: () => Promise<void>) {}
}