import test from 'ava'
import { Client, Intents } from 'discord.js'
import { Container } from '../src/Container'

test('create container', (t) => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
  const container = new Container(client)
  t.assert(container instanceof Container)
})
