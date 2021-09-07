import Factory from '../Factory'
import { BaseAddonCommand } from './AddonCommand'

export default abstract class BaseAddon {
  private factory: Factory | undefined
  public abstract registerCLI (): BaseAddonCommand[]

  private setFactory (factory: Factory) {
    this.factory = factory
  }

  public getFactory () {
    return this.factory
  }
}