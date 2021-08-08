import Factory from '../Factory'
import { QueueItem } from '../type/Container'
import { activeProvider } from '../helpers/Provider'
import SlashCommandEntity from '../entities/SlashCommandEntity'
import Manager from './Manager'

export default class SlashCommandManager extends Manager {
  public async register (item: QueueItem) {
    const $container = Factory.getInstance().$container

    const instance = new item.default()
    const slashCommand = new SlashCommandEntity(instance.scope, instance.roles, instance.context, instance.run, item.file)

    $container?.slashCommands.push(slashCommand)

    await this.activeProvider(slashCommand)
  }

  public async activeProvider (slashCommandEntity: SlashCommandEntity) {
    await activeProvider(
      Factory.getInstance().$container!,
      slashCommandEntity,
    )
  }
}