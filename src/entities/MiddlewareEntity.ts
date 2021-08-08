import { File } from 'fs-recursive'
import MiddlewareContext from '../contexts/MiddlewareContext'
import { ContainerType } from '../types'
import ConstructableEntity from './ConstructableEntity'

export default class MiddlewareEntity extends ConstructableEntity {
  public static type: ContainerType = 'middleware'
  public pattern: RegExp

  constructor (public basePattern: string, public run: (context: MiddlewareContext) => Promise<boolean>, file?: File) {
    super(MiddlewareEntity.type, file as any)
    this.pattern = new RegExp(basePattern)
  }
}