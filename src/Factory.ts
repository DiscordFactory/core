import Container from './Container'

export default class Factory {
  private static $instance: Factory
  public $container = new Container()

  public static getInstance () {
    if (!Factory.$instance) {
      Factory.$instance = new Factory()
    }
    return this.$instance
  }
}