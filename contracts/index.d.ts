declare module 'ioc:factory/Core' {
  import { Ignitor, Factory } from '@discord-factory/core-next'
  export {
    Ignitor,
    Factory,
  }
}

declare module 'ioc:factory/Core/Provider' {
  import { BaseProvider, EntityResolvable, CommandEntity, EventEntity, HookEntity } from '@discord-factory/core-next'
  export {
    BaseProvider,
    EntityResolvable,
    CommandEntity,
    EventEntity,
    HookEntity,
  }
}

declare module 'ioc:factory/Core/Container' {
  import { CommandContainer, EventContainer, HookContainer } from '@discord-factory/core-next'
  export {
    CommandContainer,
    EventContainer,
    HookContainer,
  }
}

declare module 'ioc:factory/Core/Event' {
  import { BaseEvent, Event } from '@discord-factory/core-next'
  export {
    BaseEvent,
    Event,
  }
}

declare module 'ioc:factory/Core/Command' {
  import { Command, BaseCommand } from '@discord-factory/core-next'
  export {
    BaseCommand,
    Command,
  }
}

declare module 'ioc:factory/Core/Hook' {
  import { BaseHook, Hook } from '@discord-factory/core-next'
  export {
    BaseHook,
    Hook,
  }
}

declare module 'ioc:factory/Discord/Event' {
  export * from 'discord.js'
}