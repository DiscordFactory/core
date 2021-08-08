import { QueueItem } from '../type/Container'

export default abstract class Manager {
  public abstract register (item: QueueItem): Promise<void>
}