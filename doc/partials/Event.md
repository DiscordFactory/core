```ts
import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Message } from 'discord.js'

@Event('voiceMemberJoin')
export default class FooEvent implements BaseEvent {
  public async run(message: Message): Promise<void> {
    // Your code here
  }
}
```