import test from 'ava'
import { Message } from 'discord.js'
import CommandEntity from '../build/entities/CommandEntity'
import EventEntity from '../build/entities/EventEntity'
import MiddlewareEntity from '../build/entities/MiddlewareEntity'
import { MiddlewareContext } from '../build'
import HookEntity from '../build/entities/HookEntity'

test('create command', async (t) => {
  const command = new CommandEntity(
    'Foo',
    'Description',
    'foo',
    [],
    [],
    [],
    [],
    [],
    async () => {},
  )

  t.assert(command instanceof CommandEntity)
  t.teardown(async () => await command.run({} as Message, []))
})

test('create event', (t) => {
  const command = new EventEntity('ready', async () => {})

  t.assert(command instanceof EventEntity)
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