import Factory from '../Factory'
import path from 'path'
import { fetch } from 'fs-recursive'
import { ProviderEntity } from '../entities/Provider'
import EntityFile from '../utils/EntityFile'

export default class ProviderManager {
  constructor (public factory: Factory) {
  }

  public async register (): Promise<void> {
    const baseDir = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'build', 'providers')
      : path.join(process.cwd(), 'providers')

    const fetchedFiles = await fetch(
      baseDir,
      [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
      'utf-8',
      ['node_modules']
    )

    const files = Array.from(fetchedFiles, ([key, file]) => ({ key, ...file }))

    await Promise.all(
      files.map(async (item: any) => {
        const Class = await import(item.path)
        const instance = new Class.default()
        const entityFile = new EntityFile(item.path)

        const provider = new ProviderEntity(
          instance.boot,
          instance.load,
          instance.ok,
          entityFile,
        )

        this.factory.ignitor.container.providers.push(provider)
      })
    )
  }
}