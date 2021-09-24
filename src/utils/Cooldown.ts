import { Cooldown as CooldownInterface } from '../types'
import { Collection, CommandInteraction, Snowflake } from 'discord.js'

type CooldownActions = {
  timeout: any,
  count: number
}

export default class Cooldown {
  private interaction!: CommandInteraction
  public time: number
  public count: number
  public message?: string
  public memberMap: Collection<Snowflake, CooldownActions> = new Collection()

  constructor (options: CooldownInterface,) {
    this.message = options.message
    this.time = options.time
      ? options.time
      : 0

    if (options.count && !options.time) {
      throw new Error('The "count" parameter cannot be used without defining the "time" parameter')
    }
    this.count = options.count || 1
  }

  public setInteraction (commandInteraction: CommandInteraction) {
    this.interaction = commandInteraction
  }

  public async verify () {
    if (this.time) {
      return await this.addToMap()
    }
    return true
  }

  private async addToMap (): Promise<boolean> {
    const member = this.interaction.member
    const targetMember = this.memberMap.get(member!.user.id)

    if (!targetMember) {
      this.memberMap.set(member!.user.id, {
        count: 1,
        timeout: setTimeout(() => {
          this.memberMap.delete(member!.user.id)
        }, this.time)
      })
      return this.count >= 1
    }

    if (this.count && targetMember.count >= this.count) {
      await this.interaction.reply({
        content: this.message || `You have reached maximum usage, please try again later.`,
        ephemeral: true,
      })
      return false
    }

    targetMember.count = targetMember.count + 1

    return true
  }
}