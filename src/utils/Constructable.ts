import { ClientEvents } from 'discord.js'
import { File } from 'fs-recursive'

export default class Constructable<K extends keyof ClientEvents> {
  constructor (public file?: File | { path: string }) {
    if (this.file) {
      this.file = {
        ...file,
        path: file!.path
          .replace('\\build', '')
          .replace('.js', '.ts'),
      }
    }
  }
}