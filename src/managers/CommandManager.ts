import Factory from '../Factory'
import { QueueItem } from '../type/Container'
import { activeProvider } from '../helpers/Provider'
import CommandEntity from '../entities/CommandEntity'
import Manager from './Manager'

export default class CommandManager extends Manager {
  public async register (item: QueueItem) {
    const { label, description, tag, usages, alias, roles, permissions, middlewares, run } = new item.default()

    const command = new CommandEntity(label, description, tag, usages, alias, roles, permissions, middlewares, run, item.file as any)
    Factory.getInstance().$container!.commands.push(command)
    Factory.getInstance().$container!.commandAlias[command.tag] = command

    command.alias.forEach((alias) => {
      Factory.getInstance().$container!.commandAlias[alias] = command
    })

    await this.activeProvider(command)
  }

  public async activeProvider (commandEntity: CommandEntity) {
    await activeProvider(
      Factory.getInstance().$container!,
      commandEntity,
    )
  }
}