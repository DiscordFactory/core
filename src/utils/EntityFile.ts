import { File } from 'fs-recursive'
import path from 'path'

export default class EntityFile extends File {
  public relativePath: string
  constructor (location: string) {
    super(location)
    this.relativePath = location.replace(process.cwd(), '').replace(path.sep, '')
  }
}