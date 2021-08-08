import { File } from 'fs-recursive'
import { ContainerType } from '../types'

export default class ConstructableEntity {
  constructor (public type: ContainerType, public file?: File) {
  }
}