import { Context } from './'

export default interface Provider {
  boot: () => Promise<void>
  loadFile: (context: Context) => Promise<void>
  ready: () => Promise<void>
}