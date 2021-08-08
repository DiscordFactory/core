import { ClientEvents } from 'discord.js'
import EventEntity from '../entities/EventEntity'
import Manager from './Manager'

export default class EventManager extends Manager {
  public events: Array<EventEntity<keyof ClientEvents>> = []

  public async dispatch (): Promise<void> {
  }

  public register () {

  }
}