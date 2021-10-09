import { BaseCli, CLI } from '../entities/Cli'
import { Command } from 'cac'
import { Color } from '../utils/ConsoleColors'
import { isUsingYarn, table } from '../utils'
import { CliContextRuntime } from '../types'

@CLI({
  prefix: 'help',
  description: 'Help command cli',
  alias: ['--help', '-h'],
  config: {
    allowUnknownOptions: false,
    ignoreOptionDefaultValue: true
  }
})
export default class Help extends BaseCli<unknown> {
  public async run ({ cli }: CliContextRuntime): Promise<void> {
    const registeredCommands = cli.commands
      .map((command: Command) => {
        const body = Color.Reset + Color.Dim + command.description + Color.Reset
        const heading = [`  • ${Color.Bright + Color.White + command.name}`]

        if (command.aliasNames.length) {
          heading.push(`(${command.aliasNames.join(', ')})`)
        }

        return `${heading.join(' ')} ${body}`
      })
      .sort()
      .join('\n')

    const usagePackageManager = isUsingYarn()
      ? `yarn ${cli.name}`
      : `npm run ${cli.name}`

    const options = Object.entries(cli.options).map(([key, value]) => `  • ${key} ${value.join(', ')}`)

    const instructions =
      `Usage :\n` +
      `  $ ${usagePackageManager} <command> [options]\n\n` +
      `Commands :\n` +
       `${registeredCommands}\n` + (
      options.length > 1
        ? (`Options :\n` + `${options.join('\n')}`)
        : ''
      )

    table.push(
      ['Help menu'] as any,
      [instructions] as any,
    )

    console.log('\n' + table.toString() + '\n')
  }
}