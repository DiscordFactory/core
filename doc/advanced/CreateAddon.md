# 🧱 Create your addon

When you are developing, it happens very regularly that some of your features are found to be common to several projects.

Normally, you would just copy and paste your "module" and carry it over to the next discord application.

To address this need for portability, the `Discord Factory` framework allows you to export your functionality to modules registered on the [NPM registry](https://docs.npmjs.com/cli/v7/commands/npm-publish).

## Generate a new addon
In order to simplify the design of addons, we provide you with a command to create a clean and healthy base to start your module on a good basis.
```bash
npm init factory-addon MyAddon
# or
yarn create factory-addon MyAddon
```

## Structure
```
├─ node_modules
├─ src
  ├─ commands
  ├─ types
  └─ index.ts
├─ test
.eslintignore
.eslintrc
.npmignore
LICENSE
README.md
package.json
tsconfig.json
```

### Index.ts
```ts
import { BaseAddon } from '@discord-factory/core-next'

export default class Index extends BaseAddon<Index> {
  public addonName: string = 'ADDON_NAME'

  /**
   * This function is the first to be read within the addons,
   * it allows to perform initialization actions
   */
  public async init (): Promise<Index> {
    return this
  }

  public registerHooks () {
    return []
  }

  public registerCLI () {
    return []
  }

  public registerCommands () {
    return []
  }

  public registerEvents () {
    return []
  }

  public defineKeys () {
    return []
  }
}

/**
 * Export your public elements
 */
export {
  
}
```

## Events
Using the `registerEvents()` function, you can inject events into the Factory instance.
To do this, you just have to create a "classic" event that you would create in a "normal" bot but the extended class was replaced by BaseAddonEvent<MyAddon>,
then import it __without instantiating it__ into the reto array

Within the events, commands or context menus that you design through addon design, you will have access to several methods and keys to access the context of your addon.

## Commands
Using the `registerCommands()` function, you can inject slash commands into the Factory instance.
To do this, you just have to create a "classic" command that you would create in a "normal" bot but the extended class was replaced by BaseAddonCommand<MyAddon>,
then import it __without instantiating it__ into the reto array

Within the commands, commands or context menus that you design through addon design, you will have access to several methods and keys to access the context of your addon.

## CLI
Using the `registerCLI()` function, you can inject CLI commands into the Factory instance.
To do this, you just have to create a new file like below, then import it __without instantiating it__ into the reto array

```ts
import { CLICommand, BaseAddonCommand } from '@discord-factory/core-next'
import Addon from '../index'
import Logger from '@leadcodedev/logger'
import { MigrationEntity } from '../entities/Migration'

@CLICommand({
  name: 'Label',
  prefix: 'action:sub-action',
  usages: []
})
export default class MyCLICommand extends BaseAddonCommand<Addon> {
  public async run (): Promise<void> {
    // Your code here
  }
}
```

## Addon context
Within the commands, commands or context menus that you design through addon design, you will have access to several methods and keys to access the context of your addon.

```ts
interface context {
  addon: Addon
  client: Client
  getModuleEnvironment (): string
  getContainer (): Container
  getFiles (): Collection<string, unknown>
  getSelectEnvironment (): 'yaml' | 'yml' | 'json'
}
```

Once your module is finished, you can save it on the NPM registry and import it into your bot discord application !