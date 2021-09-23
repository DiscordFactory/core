import Factory from './Factory'
import { Client, ClientEvents, Collection } from 'discord.js'
import { CommandEntity } from './entities/Command'
import { EventEntity } from './entities/Event'

export default class Application {
  public static getClient (): Client {
    return Factory.getInstance().client!
  }

  public static getCommands (): CommandEntity[] {
    return Factory.getInstance().ignitor.getContainer().commands
  }

  public static getEvents (): EventEntity<keyof ClientEvents>[] {
    return Factory.getInstance().ignitor.getContainer().events
  }

  public static getCliCommands (): Collection<string, any> {
    return Factory.getInstance().ignitor.getContainer().cli
  }

  public static getEnvironment (): { [p: string]: unknown } {
    return Factory.getInstance().ignitor.environment!.content
  }

  public static getEnvironmentValue (key: string): any | undefined {
    return Factory.getInstance().ignitor.getEnvironment(key)
  }
}