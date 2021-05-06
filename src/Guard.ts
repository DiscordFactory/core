import { GuildMember, Message } from 'discord.js'
import Env from '@discord-factory/env'
import Factory from './Factory'

export default class Guard {
  public async protect (message: Message) {
    const sender: GuildMember | null = message.member
    const args: Array<string> = message.content.split(' ')

    if (message.author.bot) {
      return
    }

    const prefix: string | undefined = Env.get('PREFIX')

    if (!prefix) {
      throw new Error('The prefix cannot be found, please define it in your environment file')
    }
    const alias: string = args[0].replace(prefix, '')

    const commands = Factory.getInstance().$container.commandAlias
    const command = commands[alias]

    if (command) {
      return await command.run(message, args.slice(1))
    }
  }
}