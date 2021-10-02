```ts
import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { GuildMember, VoiceChannel } from 'discord.js'

@Event('voiceMemberJoin')
export default class FooEvent implements BaseEvent {
  public async run(member: GuildMember, channel: VoiceChannel): Promise<void> {
    // Your code here
  }
}
```