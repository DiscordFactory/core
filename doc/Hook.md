# ⚓ Hook
When you develop an application with a framework, you are generally blocked by the fact that you cannot interact at certain times during the initialization of the framework...
This is a real problem that is solved by using hooks. Creating a hook with the framework is very simple.

## Create new hook from CLI
Open a new terminal in your project and write the following command :

```bash
yarn factory make:hook <filename>
```
::: info
It is important to note that when you define the file name, you can `place` the file in folders by specifying a path directory in addition to the file name as in the following example.
:::

## Default hook file
A file will be created in the specified location otherwise in the root of your project with the following structure :

```ts
import { Hook, BaseHook } from 'ioc:factory/Core/Hook'
import { Message } from 'discord.js'

@Hook('hooks')
export default class FooHook implements BaseHook {
  public async run(...params: unknown[]): Promise<void> {
    // Your code here
  }
}
```