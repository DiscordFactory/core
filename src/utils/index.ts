import Logger from '@leadcodedev/logger'
import { MessageComponentInteraction } from 'discord.js'
import CliTable from 'cli-table2'

export const catchPromise = (error) => {
  Logger.send('error', error.message)
  process.exit(1)
}

const isObject = (param: any): boolean => Object.prototype.toString.call(param) === "[object Object]"

const compareValue = (a: any, b: any, prop: string | number): boolean => {
  if (isObject(a[prop]) && isObject(b[prop])) {
    if (!isObjectEquivalent(a[prop], b[prop])) {
      return false
    }
  } else if (Array.isArray(a[prop]) && Array.isArray(b[prop])) {
    if (!isArrayEquivalent(a[prop], b[prop])) {
      return false
    }
  } else if (a[prop] !== b[prop]) {
    return false
  }

  return true
}

const isArrayEquivalent = (a: Array<any>, b: Array<any>): boolean => {
  if (!a || !b || !Array.isArray(a) || !Array.isArray(b)) {
    return false
  }

  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (!compareValue(a, b, i)) return false
  }

  return true
}

const isObjectEquivalent = (a: Object, b: Object): boolean => {
  if (!a || !b || !isObject(a) || !isObject(b)) {
    return false
  }

  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)

  if (aProps.length !== bProps.length) {
    return false
  }

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]

    if (!compareValue(a, b, propName)) {
      return false
    }
  }

  return true
}

export const isEquivalent = (a: any, b: any): boolean => {
  if (!a || !b) {
    return false
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return isArrayEquivalent(a, b)
  }

  if (isObject(a) || isObject(b)) {
    return isObjectEquivalent(a, b)
  }

  return a === b
}

export function emptyReply (interaction: MessageComponentInteraction) {
  (interaction.client as any).api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 6,
      data: {
        flags: null,
      }
    }
  })
}

export const table = new CliTable({
  chars: {
    'top-left': '╭',
    'top-right': '╮',
    'bottom-left': '╰',
    'bottom-right': '╯',
    top: '─',
    bottom: '─',
    left: '│',
    right: '│',
  },
  rowAligns: ['center', 'center'],
})

export function isUsingYarn () {
  return (process.env.npm_config_user_agent || '').indexOf('yarn') === 0;
}