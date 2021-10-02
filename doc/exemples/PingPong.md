#  Ping pong

A concrete example would be the console display of the files instantiated in your application :

```bash
npm run factory make:command PingPong
# or
yarn factory make:command PingPong
```

```ts
import { BaseCommand, Command } from 'ioc:factory/Core/Command'
import { CommandInteraction } from 'discord.js'

@Command({
  scope: 'GUILDS',
  options: {
    name: 'ping',
    description: 'Ping-pong command',
    options: [],
  },
})
export default class PingCommand implements BaseCommand {
  public async run(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Pong !')
  }
}
```