import SlashCommandEntity from '../entities/SlashCommandEntity'
import { ScopeContext, SlashContext } from '../interface/SlashCommandInterface'

export default function SlashCommand (scope: ScopeContext, context: SlashContext) {
  return (target: Function) => {
    return class SlashCommand extends SlashCommandEntity {
      constructor () {
        super(scope, context, target.prototype.run)
      }
    }
  }
}