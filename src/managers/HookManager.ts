import Factory from '../Factory'
import { activeProvider } from '../utils'
import { HookEntity } from '../entities/Hook'
import NodeEmitter from '../utils/NodeEmitter'

export default class HookManager {

  constructor (public factory: Factory) {
  }

  public async register () {
    const files = this.factory.ignitor.files.filter((file: any) => file.type === 'hook')

    await Promise.all(
      files.map(async (item: any) => {
        const instance = new item.default()
        const hook = new HookEntity(
          instance.type,
          instance.run,
          item.file
        )

        NodeEmitter.on(hook.type, async (...props: any[]) => {
          await hook.run(...props)
        })

        await activeProvider(
          this.factory.ignitor.container,
          hook
        )
      })
    )
  }
}