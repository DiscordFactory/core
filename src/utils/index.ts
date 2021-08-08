import { GuildMember } from 'discord.js'

export function hasRole (sender: GuildMember, roles: Array<string>) {
  if (roles.length) {
    return roles.some((role: string) => {
      return sender.roles.cache.has(role)
    })
  }
  return true
}