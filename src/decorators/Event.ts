import { ClientEvents } from 'discord.js'
import BaseEvent from '../entities/BaseEvent'

export default function Event<K extends keyof ClientEvents>(identifier: K) {
  return (target: Function) => {
    return class Event extends BaseEvent<K> {
      constructor() {
        super(identifier, target.prototype.run)
      }
    }
  }
}