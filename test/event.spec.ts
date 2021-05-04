import test from 'ava'
import Event from '../src/Container/Events'

test('create event', (t) => {
  const event = new Event()
  t.assert(event instanceof Event)
})