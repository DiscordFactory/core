import { ClientEvents } from 'discord.js'
import { ContainerModules, ContainerType, Instance } from './type/Container'

export default class Constructable<K extends keyof ClientEvents> {
  constructor (public type: ContainerType, public model: any, public instance?: Instance<K>, public file?: any) {
    if (this.file) {
      this.file = {
        ...file,
        path: file.path
          .replace('\\build', '')
          .replace('.js', '.ts'),
      }
    }
  }
}