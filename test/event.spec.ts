import test from 'ava'
import BaseEvent from '../src/entities/BaseEvent'

test('create event', (t) => {
  const event = new BaseEvent('message', async () => {
    console.log('Hello World !')
  })
  t.assert(event instanceof BaseEvent)
})