import File from 'fs-recursive/build/File'
import { ContainerType } from './type/Container'

export default class Dispatcher {
  constructor (private files: Map<string, File>) {}

  public async dispatch () {
    const array = Array.from(this.files, ([_, file]) => ({ ...file }))
    const objects = await Promise.all(array.map(async (file) => {
      const res = await import(file.path)
      if (res?.default?.type) {
        return {
          type: res.default.type as ContainerType,
          constructable: res.default,
          path: file.path.replace('\\build', '').replace('.js', '.ts'),
        }
      }
    }))
    const constructable = objects.filter(object => object !== undefined)
    
    console.log(constructable)
  }
}