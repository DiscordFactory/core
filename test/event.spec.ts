import test from 'ava'
import EventEntity from '../src/entities/EventEntity'

test('create event', (t) => {
  const event = new EventEntity('message', async () => {
    console.log('Hello World !')
  })
  t.assert(event instanceof EventEntity)
})