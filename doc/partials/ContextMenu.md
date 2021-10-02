```ts
import { BaseContextMenu, ContextMenu } from 'ioc:factory/Core/ContextMenu'
import { ContextMenuInteraction } from 'discord.js'

@ContextMenu({
  scope: 'GUILDS',
  options: {
    name: 'foo',
    type: 'USER'
  },
})
export default class FooContextMenu implements BaseContextMenu {
  public async run(interaction: ContextMenuInteraction): Promise<void> {
    // Your code here
  }
}

```