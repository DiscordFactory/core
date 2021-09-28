# Application

When you develop your application, you will have to import and operate your [discord client](https://discord.js.org/#/docs/main/stable/class/Client).

For performance reasons, the `client` instance is not transferred to the instance of your files such as events, commands, hooks, etc.

However, you can still access it via an `entry` class as below :
```ts
import { Application } from 'ioc:factory/Core'
```

### Client
```ts
import { Application } from 'ioc:factory/Core'
import { Client } from 'discord.js'

const client: Client = Application.getClient()
console.log(client)
```

### Environment
```ts
import { Application } from 'ioc:factory/Core'

const environment: { [p: string]: unknown } = Application.getEnvironment()
console.log(environment)
```

### Environment
```ts
import { Application } from 'ioc:factory/Core'

const key: unknown | undefined = Application.getEnvironmentValue()
console.log(key)
```

### Events
```ts
import { Application } from 'ioc:factory/Core'
import { EventEntity } from 'ioc:factory/Core/Provider'

const commands: EventEntity[]  = Application.getEvents()
console.log(commands)
```

### Commands
```ts
import { Application } from 'ioc:factory/Core'
import { CommandEntity } from 'ioc:factory/Core/Provider'

const commands: CommandEntity[]  = Application.getCommands()
console.log(commands)
```

### Context menus
```ts
import { Application } from 'ioc:factory/Core'
import { ContextMenuEntity } from 'ioc:factory/Core/Provider'

const contextMenus: ContextMenuEntity[]  = Application.getContextMenu()
console.log(contextMenus)
```