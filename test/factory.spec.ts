import test from 'ava'
import Factory from '../src/Factory'

test('get factory instance', (t) => {
  const instance = Factory.getInstance()
  t.assert(instance instanceof Factory)
})