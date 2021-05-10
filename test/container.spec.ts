import test from 'ava'
import Container from '../src/Container'

test('create container', (t) => {
  const container = new Container()
  t.assert(container instanceof Container)
})
