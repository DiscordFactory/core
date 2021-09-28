# Event
The design of a discord bot spends most of the time developing commands. The purpose of these commands is to execute certain actions by the moderation or the community.
Creating an event with the framework is very simple.

## Create new event from CLI
Open a new terminal in your project and write the following command :

```bash
yarn factory make:event <filename>
```
::: info
It is important to note that when you define the file name, you can `place` the file in folders by specifying a path directory in addition to the file name as in the following example.
:::

## Default event file
A file will be created in the specified location otherwise in the root of your project with the following structure :

```ts
import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Message } from 'discord.js'

@Event('message')
export default class FooEvent implements BaseEvent {
  public async run(message: Message): Promise<void> {
    // Your code here
  }
}
```

## New exclusive Factory events

### Event : websocketDebug
The `websocketDebug` event provides you with payloads received from the Discord API.
```ts
import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Message } from 'discord.js'

@Event('websocketDebug')
export default class FooEvent implements BaseEvent {
  public async run(payload: any): Promise<void> {
    // Your code here
  }
}
```

### Event : voiceMemberJoin
The `voiceMemberJoin` event is emitted when a member joins a voice channel.

```ts
import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Message, StageChannel, VoiceChannel } from 'discord.js'

@Event('voiceMemberJoin')
export default class FooEvent implements BaseEvent {
  public async run (member: GuildMember, channel: VoiceChannel | StageChannel): Promise<void> {
    // Your code here
  }
}
```

### Event : voiceMemberLeave
The `voiceMemberLeave` event is emitted when a member leaves a voice channel.

```ts
import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { Message, StageChannel, VoiceChannel } from 'discord.js'

@Event('voiceMemberJoin')
export default class FooEvent implements BaseEvent {
  public async run (member: GuildMember, channel: VoiceChannel | StageChannel): Promise<void> {
    // Your code here
  }
}
```

### Event : guildMemberAddBoost
The `guildMemberAddBoost` event is emitted when a new member boosts the server.
```ts
import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { GuildMember } from 'discord.js'

@Event('guildMemberAddBoost')
export default class FooEvent implements BaseEvent {
  public async run(member: GuildMember): Promise<void> {
    // Your code here
  }
}
```

### Event : guildMemberRemoveBoost
The `guildMemberRemoveBoost` event is emitted when a member no longer boosts the server.
```ts
import { Event, BaseEvent } from 'ioc:factory/Core/Event'
import { GuildMember } from 'discord.js'

@Event('guildMemberRemoveBoost')
export default class FooEvent implements BaseEvent {
  public async run(member: GuildMember): Promise<void> {
    // Your code here
  }
}
```