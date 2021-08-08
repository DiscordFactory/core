import { QueueItem } from '../types'

export default abstract class Manager {
  public abstract register (item: QueueItem): Promise<void>
}