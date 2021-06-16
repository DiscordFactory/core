import { ContainerType } from '../type/Container'

export default class ConstructableEntity {
  constructor (public type: ContainerType, public file?: File) {
  }
}