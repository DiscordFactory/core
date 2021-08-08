import File from 'fs-recursive/build/File'
import { Hook } from '../types/Hook'
import { ContainerType } from '../types'
import ConstructableEntity from './ConstructableEntity'

export default class HookEntity extends ConstructableEntity {
  public static type: ContainerType = 'hook'

  constructor (public hook: Hook, public run: (...args) => Promise<void>, file?: File) {
    super(HookEntity.type, file as any)
  }
}