# Structure
The framework offers a very modular way of structuring your files within your application, the only restriction is that they must be included in the src/ folder as this represents level 0 of your application (also called root directory).
```
├─ node_modules
├─ contracts
├─ provider
  └ AppProvider.ts
├─ src
├─ start
  ├─ index.ts
  └ Kernel.ts
├─ test
environment.dev.(yaml|json)
environment.prod.(yaml|json)
.eslintignore
.eslintrc
.npmignore
LICENSE
README.md
package.json
tsconfig.json
```

### Index
This folder contains the files needed to start the application.
You will find the index, the `entry point` of the application which initializes the application.

###### App/Start/index.ts
```ts
import { Ignitor } from '@discord-factory/core-next'

const ignitor = new Ignitor()
ignitor.createFactory()
```

::: info
The index.ts file in the start folder is the entry point for your application.
:::

## Kernel
The `Kernel.ts` file is essential to the use of the framework,
this file is initialized in the first ones and allows to inject modules, commands, events or database drivers, etc

###### App/Start/Kernel.ts
```ts
import CoreCommands from '@discord-factory/core-commands' 👈 // Import your module from NPM node_modules

export default class Kernel {
  public registerAddons () {
    return [CoreCommands] 👈 // Use your module here, do not instanciate it.
  }
}
```

## Provider
Providers are files that have certain methods defined in advance.
You can create them at will as long as they are built in the following way :

###### App/Providers/AppProvider.ts
```ts
import { BaseProvider, EntityResolvable } from 'ioc:factory/Core/Provider'
import Logger from '@leadcodedev/logger'

export default class AppProvider implements Provider {
  public async boot (): Promise<void> {
    Logger.send('info', 'Application start')
    // Your code here
  }

  public async load (Class: EntityResolvable): Promise<void> {
    Logger.send('info', `Load file ${Class.file?.relativePath}`)
    // Your code here
  }

  public async ok (): Promise<void> {
    Logger.send('info', 'Application is ready')
    // Your code here
  }
}
```

::: info
You can create as many providers as you like, they will be executed in alphabetical order.
You can learn more here.
:::

These files are read first, even before the recovery of the command files, events...
It can be very interesting to use them to record a default behaviour before the application is ready to run.

## Src
The `src/` folder is the base folder for your project.
This is where you will work.Please consider this folder as the root of your application.

The advantage of considering the `src/` folder as the base of your application is that you can structure it as you see fit.
It can be interesting to look at design patterns, here are some of them :

- [Monolithic Architecture vs Microservice](https://www.geeksforgeeks.org/monolithic-vs-microservices-architecture/)
- [NodeTSkeleton, a clean architecture](https://dev.to/vickodev/nodetskeleton-clean-arquitecture-template-project-for-nodejs-gge)
- [Hexagonal Architecture](https://blog.octo.com/architecture-hexagonale-trois-principes-et-un-exemple-dimplementation)

Please use the factory make:file command to create a file quickly

Import with alias
The `src/` folder is the base folder for your project.
To simplify the import of your files, the alias `App/` is available.
This alias refers to the root folder src/.

```ts
- import Foo from '../../../Foo'
+ import Foo from 'App/Folder/Foo'
```

## Testing
It is very important to test your code using unit tests for small features or integration tests for large features.
This folder allows you to write tests on files named `foo.spec.ts`.
The default test framework used in the Discord Factory framework is ava but you can replace it with any other.

::: warning
Do not neglect unit or integration testing.
They are extremely useful in the medium/long term.
Indeed, when you develop a new feature, it must not break the existing code, this is called regression.
:::

The strict minimum code is as follows :

```ts
import test from 'ava'

test('foo', (t) => {
  t.pass()
})
```

Then you can use the followed command to run your tests :

```bash
npm install
# or
yarn install
```