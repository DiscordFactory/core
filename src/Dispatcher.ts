import File from 'fs-recursive/build/File'
import { ClientEvents } from 'discord.js'
import { Constructable, ContainerType } from './type/Container'
import Factory from './Factory'
import Event from './container/Event'

export default class Dispatcher {
  constructor (private files: Map<string, File>) {}

  public async dispatch () {
    const array = Array.from(this.files, ([_, file]) => ({ ...file }))
    const objects = await Promise.all(array.map(async (file) => {
      const res = await import(file.path)
      if (res?.default?.type) {
        return {
          type: res.default.type,
          default: res.default,
          path: file.path.replace('\\build', '').replace('.js', '.ts'),
        } as Constructable
      }
    }))
    const constructableList = objects.filter(object => object !== undefined)
    
    const wrapper = {
      event: (constructable: Constructable) => this.assignEvent(constructable),
      unknown: () => ({}),
    }
    constructableList.forEach((constructable) => {
      const containerPlacement = (wrapper[constructable!.type] || wrapper.unknown)(constructable)
    })
  }

  private assignEvent<K extends keyof ClientEvents> (constructable: Constructable) {
    const $container = Factory.getInstance().$container
    const instance: Event<K> = new (constructable.default)()
    $container.register('events', constructable)
    $container.client.on(instance.event, async (...args: Array<any>) => await instance.run(...args))
  }
}