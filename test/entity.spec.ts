import test from 'ava'
import { Message } from 'discord.js'
import CommandEntity from '../src/entities/CommandEntity'
import EventEntity from '../src/entities/EventEntity'
import MiddlewareEntity from '../src/entities/MiddlewareEntity'
import { MiddlewareContext } from '../src'
import HookEntity from '../src/entities/HookEntity'

const command = new CommandEntity('Foo', 'Description', 'foo', [], [], [], [], [], async () => {})

test('create command', async (t) => {
  t.assert(command instanceof CommandEntity)
  t.teardown(async () => await command.run({} as Message, []))
})

test('create event', (t) => {
  const event = new EventEntity('ready', async () => {})
  t.assert(event instanceof EventEntity)
})

test('create middleware', async (t) => {
  function factory(callback: boolean) {
    return new MiddlewareEntity('(?<count>\\d+)-args', async () => {
      return callback
    })
  }

  t.assert(factory(true) instanceof MiddlewareEntity)
  t.true(await factory(true).run({} as MiddlewareContext))
  t.false(await factory(false).run({} as MiddlewareContext))
})

test('create hook', async (t) => {
  const entity = new HookEntity('app:command:executed', async () => {})

  t.assert(entity instanceof HookEntity)
  t.is(entity.hook, 'app:command:executed')
  t.teardown(() => console.log('Hello hook !'))
})