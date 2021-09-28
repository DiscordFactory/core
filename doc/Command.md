# Commands
The [version 13 update](https://github.com/discordjs/discord.js/blob/main/CHANGELOG.md#1300-2021-08-06) of [discord.js](https://discord.js.org) marks the arrival of Slash Commands.
This new feature provides real support for developers who want to create commands on their bots.
Discord has announced that it will gradually replace the old ordering system we all knew, based on a prefix as the first character of a message, with this new ordering system.

## Create new command from CLI
Open a new terminal in your project and write the following command :

```bash
yarn factory make:command <filename>
```
::: info
It is important to note that when you define the file name, you can `place` the file in folders by specifying a path directory in addition to the file name as in the following example.
:::

## Default command file

A file will be created in the specified location otherwise in the root of your project with the following structure :

```ts
import { BaseCommand, Command } from 'ioc:factory/Core/Command'
import { CommandInteraction } from 'discord.js'

@Command({
  scope: ['your guild id'], 👈 // Or 'GLOBAL' or 'GUILDS
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
## Decorator options
A file will be created in the specified location otherwise in the root of your project with the following structure :

```ts
export interface CommandGlobalContext {
  scope: 'GLOBAL' | 'GUILDS' | Snowflake[], 👈 // Or 'GLOBAL' if you want to register globally
  permissions?: ApplicationCommandPermissionData[],
  cooldown?: {
    time: number 👈 // Measured in milliseconds
    count: number 👈 // Cannot be used without time
  }
  options: {
    name: string,
    description: string,
    options: ApplicationCommandOption[],
  }
}
```
The `cooldown` key allows you to define a maximum number of uses during a defined time period for the user who will execute the associated command.

You can set only the `time` key if you wish to limit the use of the command for a certain period of time. If `count` is not set, the maximum number of times the command can be used for the set time will be `1`.

::: warning
The `count` key cannot be used if `time` is not set.
:::

See more about ApplicationCommandOption [here](https://discord.js.org/#/docs/main/stable/typedef/ApplicationCommandOption)