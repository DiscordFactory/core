import { ClientEvents } from 'discord.js'
import EventEntity from '../entities/EventEntity'

export default function Event<K extends keyof ClientEvents>(identifier: K) {
  return (target: Function) => {
    return class Event extends EventEntity<K> {
      constructor() {
        super(identifier, target.prototype.run)
      }
    }
  }
}