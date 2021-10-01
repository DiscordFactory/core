# 📌 Set application presence from provider

A concrete example would be the console display of the files instantiated in your application :

```ts
import { Application } from 'ioc:factory/Core'
import { BaseProvider, EntityResolvable } from 'ioc:factory/Core/Provider'
import Logger from '@leadcodedev/logger'

export default class AppProvider implements Provider {
  public async boot(): Promise<void> {
    Logger.send('info', 'Application start')
    // Your code here
  }

  public async load (Class: EntityResolvable): Promise<void> {
    if (Class instanceof CommandEntity) {
      Logger.send('info', `The file named ${Class.ctx.name} was loaded`)
    }
  }

  // When your bot is ready, You can set its presence like this
  public async ok (): Promise<void> {
    // Get client
    const client: Client = Application.getClient()
    
    // Set presence
    await client.user.setPresence({
      status: 'idle',
        afk: false,
        activities: [
        { name: 'Trying presence', type: 'STREAMING', url: 'streaming url' }
      ]
    })
    
    const { presence, username } = client.user
    Logger.send('info', `Application is ready and the presence of ${username} is define to ${presence.status}`)
  }
}
```

The context object collects the various file types in your application