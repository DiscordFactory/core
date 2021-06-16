import File from 'fs-recursive/build/File'
import { Hooks } from '../type/Hooks'
import { ContainerType } from '../type/Container'
import ConstructableEntity from './ConstructableEntity'

export default class HookEntity extends ConstructableEntity {
  public static type: ContainerType = 'hook'

  constructor (public hook: Hooks, public run: (...args) => Promise<void>, file?: File) {
    super(HookEntity.type, file as any)
  }
}