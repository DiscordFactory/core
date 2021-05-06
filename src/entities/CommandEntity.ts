import { Message, PermissionResolvable } from 'discord.js'
import { MiddlewareInterface } from '../interface/MiddlewareInterface'

export default class CommandEntity {
  public static type: string = 'command'
  public _path: string = ''

  constructor(
    public label: string,
    public description: string,
    public tag: string,
    public usage: Array<string> = [],
    public alias: Array<string> = [],
    public roles: Array<string> | undefined,
    public permissions: Array<PermissionResolvable> | undefined,
    public requires: Array<{ name: string; pointer: MiddlewareInterface }> = [],
    public run: (message: Message, args: Array<string>) => Promise<void>,
  ) {}

  public set path(value: string) {
    this._path = value
  }

  public get path() {
    return this._path
  }
}