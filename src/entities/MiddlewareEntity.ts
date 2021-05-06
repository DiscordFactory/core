import MiddlewareContext from '../contexts/MiddlewareContext'

export default class MiddlewareEntity {
  public static type: string = 'middleware'
  public pattern: RegExp

  constructor(public basePattern: string, public run: (context: MiddlewareContext) => Promise<boolean>) {
    this.pattern = new RegExp(basePattern)
  }
}