import { File } from 'fs-recursive'
import { ContainerType } from '../type/Container'

export default class ConstructableEntity {
  constructor (public type: ContainerType, public file?: File) {
  }
}