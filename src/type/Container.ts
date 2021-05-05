export type ContainerType = 'event' | 'command' | 'hook' | 'prerequisite'

export type ContainerModules = 'events' | 'commands' | 'hooks' | 'prerequisites'

export type Constructable = {
  type: ContainerType
  default: any
  path: string
}