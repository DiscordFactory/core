import Factory from './Factory'
import { Client, ClientEvents, Collection } from 'discord.js'
import { CommandEntity } from './entities/Command'
import { EventEntity } from './entities/Event'
import { ContextMenuEntity } from './entities/ContextMenu'

export default class Application {
  public static getClient (): Client {
    return Factory.getInstance().client!
  }

  public static getCommands (): CommandEntity[] {
    return Factory.getInstance().ignitor.getContainer().commands
  }

  public static getContextMenu (): ContextMenuEntity[] {
    return Factory.getInstance().ignitor.getContainer().contextMenu
  }

  public static getEvents (): EventEntity<keyof ClientEvents>[] {
    return Factory.getInstance().ignitor.getContainer().events
  }

  public static getCliCommands (): Collection<string, any> {
    return Factory.getInstance().ignitor.getContainer().cli
  }

  public static getEnvironment (): { [p: string]: unknown } {
    return Factory.getInstance().ignitor.environmentBuilder.environment!.content
  }

  public static getEnvironmentValue (key: string): unknown | undefined {
    return Factory.getInstance().ignitor.getEnvironment(key)
  }
}