import File from 'fs-recursive/build/File'
import MiddlewareContext from '../contexts/MiddlewareContext'
import { ContainerType } from '../type/Container'
import ConstructableEntity from './ConstructableEntity'

export default class MiddlewareEntity extends ConstructableEntity {
  public static type: ContainerType = 'middleware'
  public pattern: RegExp

  constructor (public basePattern: string, public run: (context: MiddlewareContext) => Promise<boolean>, file?: File) {
    super(MiddlewareEntity.type, file as any)
    this.pattern = new RegExp(basePattern)
  }
}