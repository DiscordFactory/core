```ts
import { BaseCommand, Command } from 'ioc:factory/Core/Command'
import { CommandInteraction } from 'discord.js'

@Command({
  scope: 'GUILDS',
  options: {
    name: 'foo',
    description: 'Your foo command description',
    options: [],
  },
})
export default class FooCommand implements BaseCommand {
  public async run(interaction: CommandInteraction): Promise<void> {
    // Your code here
  }
}

```