import Factory from '../Factory'
import { HookEntity } from '../entities/Hook'
import NodeEmitter from '../utils/NodeEmitter'
import { ProviderEntity } from '../entities/Provider'

export default class HookManager {

  constructor (public factory: Factory) {
  }

  public async register (): Promise<void> {
    const files = this.factory.ignitor.files.filter((file: any) => file.type === 'hook')

    await Promise.all(
      files.map(async (item: any) => {
        const instance = new item.default()
        const hook = new HookEntity(
          undefined,
          instance.type,
          instance.run,
          item.file,
        )

        NodeEmitter.on(hook.type, async (...props: any[]) => {
          await hook.run(...props)
        })

        this.factory.ignitor.container.providers.forEach((provider: ProviderEntity) => {
          provider.load(hook)
        })
      })
    )
  }
}