import test from 'ava'
import Container from '../src/container'

test('create container', (t) => {
  const container = new Container()
  t.assert(container instanceof Container)
})