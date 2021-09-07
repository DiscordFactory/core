import test from 'ava'
import Factory from '../oldsrc/Factory'

test('get factory instance', (t) => {
  const instance = Factory.getInstance()
  t.assert(instance instanceof Factory)
})