import test from 'ava'
import Event from '../src/container/Event'

test('create event', (t) => {
  const event = new Event()
  t.assert(event instanceof Event)
})