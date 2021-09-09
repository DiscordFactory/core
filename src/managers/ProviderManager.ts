import Factory from '../Factory'
import path from 'path'
import { fetch } from 'fs-recursive'
import { ProviderEntity } from '../entities/Provider'

export default class ProviderManager {
  constructor (public factory: Factory) {
  }

  public async register () {
    const baseDir = path.join(process.cwd(), 'providers')
    const fetchedFiles = await fetch(
      baseDir,
      [process.env.NODE_ENV === 'production' ? 'js' : 'ts'],
      'utf-8',
      ['node_modules']
    )

    console.log(fetchedFiles)
    const files = Array.from(fetchedFiles, ([key, file]) => ({ key, ...file }))

    await Promise.all(
      files.map(async (item: any) => {
        const Class = await import(item.path)
        const instance = new Class.default()
        console.log(instance.boot, item)
        const provider = new ProviderEntity(
          instance.boot,
          instance.load,
          instance.ok,
          item,
        )

        console.log(provider)
      })
    )

    //
    // const files = this.factory.ignitor.files.filter((file: any) => file.type === 'provider')
    //
    // await Promise.all(
    //   files.map(async (item: any) => {
    //     const instance = new item.default()
    //     const event = new EventEntity(
    //       instance.event,
    //       instance.run,
    //       item.file
    //     )
    //
    //     this.emit(instance)
    //
    //     await activeProvider(
    //       this.factory.ignitor.container,
    //       event
    //     )
    //   })
    // )
  }
}