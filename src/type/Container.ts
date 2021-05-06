import File from 'fs-recursive/build/File'
import CommandEntity from '../entities/CommandEntity'

export type ContainerType = 'event' | 'command' | 'hook' | 'middleware'

export type ContainerModules = 'events' | 'commands' | 'commandAlias' | 'hooks' | 'middlewares'

export type Constructable = {
  type: ContainerType
  default: any
  instance: any
  file: File
}

export type CommandAlias = {
  [key: string]: CommandEntity
}