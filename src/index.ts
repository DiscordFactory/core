import Ignitor from './Ignitor'
import Factory from './Factory'
import { Addon, AddonCommand, BaseAddonCommand, BaseAddon, CLICommand } from './entities/Addon'
import { Event, BaseEvent } from './entities/Event'
import ModuleAlias from 'module-alias'
import path from 'path'

ModuleAlias.addAlias('ioc:factory/Core', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
ModuleAlias.addAlias('ioc:factory/Core/Event', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
ModuleAlias.addAlias('ioc:factory/Core/Command', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
ModuleAlias.addAlias('ioc:factory/Core/Hook', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
ModuleAlias.addAlias('ioc:factory/Core/Middleware', () => path.join(process.cwd(), 'node_modules', '@discord-factory', 'core-next'))
ModuleAlias.addAlias('ioc:factory/Discord/Event', () => path.join(process.cwd(), 'node_modules', 'discord.js'))

export {
  Ignitor,
  Factory,

  Addon,
  AddonCommand,
  BaseAddonCommand,
  BaseAddon,
  CLICommand,

  Event,
  BaseEvent,
}