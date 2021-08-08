export interface BaseEvent {
  run (...args: any): Promise<void>
}