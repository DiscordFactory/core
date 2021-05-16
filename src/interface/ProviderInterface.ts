import Constructable from '../Constructable'

export default interface Provider {
  boot: () => Promise<void>
  loadFile: (file: Constructable<any>) => Promise<void>
  ready: () => Promise<void>
}