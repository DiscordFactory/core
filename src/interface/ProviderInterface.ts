import { Context } from '../type/Container'

export default interface Provider {
  boot: () => Promise<void>
  loadFile: (context: Context) => Promise<void>
  ready: () => Promise<void>
}