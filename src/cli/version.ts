import { BaseCli, CLI } from '../entities/Cli'
import path from 'path'
import { table } from '../utils'
import { CliContextRuntime } from '../types'

@CLI({
  prefix: 'version',
  description: 'Displays the version of the Factory packages',
  alias: ['--version', '-v'],
  config: {
    allowUnknownOptions: false,
    ignoreOptionDefaultValue: true
  }
})
export default class Version extends BaseCli<unknown> {
  public async run ({ cli }: CliContextRuntime): Promise<void> {
    const jsonPackage = await import(path.join(process.cwd(), 'package.json'))
    const discordFactoryPackages = Object.entries(jsonPackage.dependencies).map(([key, version]) => {
      const discriminator = '@discord-factory/'
      if (key.startsWith(discriminator)) {
        const packageName = key
          .replace(new RegExp(discriminator, ''), '')
          .replace(/-/g, ' ')
        return `• ${packageName.charAt(0).toUpperCase() + packageName.slice(1, packageName.length)} : ${version}\n`
      }
    }).filter((a) => a)

    const instructions =
      `${discordFactoryPackages.join('\n')}\n`

    table.push(
      ['Packages versions'] as any,
      [instructions] as any,
    )

    console.log('\n' + table.toString() + '\n')
  }
}