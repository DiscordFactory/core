import Factory from './Factory'

Factory.getInstance().init().then(() => {
  console.log(Factory.getInstance().$container.events)
})