#  ❔ How to use buttons

A concrete example would be the console display of the files instantiated in your application :

```bash
npm run factory make:command PingPong
# or
yarn factory make:command PingPong
```

```ts
import { BaseCommand, Command } from 'ioc:factory/Core/Command'
import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js'

@Command({
  scope: 'GUILDS',
  options: {
    name: 'show-buttons',
    description: 'Show buttons command',
    options: [],
  },
})
export default class PingCommand implements BaseCommand {
  public async run (interaction: CommandInteraction): Promise<void> {
    const button = new MessageButton()
      .setStyle('SUCCESS')
      .setEmoji('✔')
      .setLabel('Success')
      .setCustomId('unique-button-id')
    
    const row = new MessageActionRow()
      .addComponents(button)

    await interaction.reply({
      content: 'I send my buttons',
      components: [row]
    })
  }
}
```