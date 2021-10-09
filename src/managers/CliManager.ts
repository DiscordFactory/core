import Ignitor from '../Ignitor'
import { BaseCli, CliCommand } from '../entities/Cli'
import { CAC, cac } from 'cac'

export default class CliManager {
  public readonly cli: CAC = cac('factory')
  constructor (private ignitor: Ignitor) {
  }

  public register (...commands: BaseCli<unknown>[]) {
    const cliCommands = commands as unknown as CliCommand[]
    cliCommands.forEach((command: CliCommand) => {
      this.registerCommand(command, command.prefix)
    })
  }

  private registerCommand (command: CliCommand, prefix: string) {
    const args = {}
    if (command.args?.length) {
      process.argv
        .slice(3, process.argv.length)
        .forEach((item: string, key: number) => args[command.args![key]] = item)
    }

    const cliCommand = this.cli
      .command(prefix, command.description, command.config)
      .action(async (options) => {
        await command.run({
          cli: this.cli,
          ignitor: this.ignitor,
          options,
          args
        })
      })

    if (command.alias?.length) {
      command.alias.forEach((alias) => {
        cliCommand.alias(alias)
      })
    }

    if (command.options?.length) {
      command.options.forEach((option) => {
        cliCommand.option(option.name, option.description, option.config)
      })
    }

    if (command.config?.ignoreOptionDefaultValue) cliCommand.config.ignoreOptionDefaultValue = command.config?.ignoreOptionDefaultValue
    if (command.config?.allowUnknownOptions) cliCommand.config.allowUnknownOptions = command.config?.allowUnknownOptions
  }
}