import File from 'fs-recursive/build/File'
import { HookType } from '../types/Hook'
import { ContainerType } from '../types'
import ConstructableEntity from './ConstructableEntity'

export default class HookEntity extends ConstructableEntity {
  public static type: ContainerType = 'hook'

  constructor (public hook: HookType, public run: (...args) => Promise<void>, file?: File) {
    super(HookEntity.type, file as any)
  }
}