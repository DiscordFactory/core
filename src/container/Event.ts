import { ClientEvents } from 'discord.js'
import { ContainerType } from '../type/Container'
import Container from './'

export default class Event<K extends keyof ClientEvents> extends Container<K> {
  public static type: ContainerType = 'event'
  public _path: string = ''

  constructor (public event: K, public run: (...args: Array<any>) => Promise<void>) {
    super()
  }

  public get path (): string {
    return this._path
  }

  public set path (value: string) {
    this._path = value
  }
}