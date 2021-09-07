import { ClientEvents } from 'discord.js'

export default class Constructable<K extends keyof ClientEvents> {
  constructor (public file?: any) {
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