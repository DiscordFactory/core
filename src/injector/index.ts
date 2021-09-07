const METADATA_PROPERTY = Symbol()

interface Metadata {
  parameters: { [s: number]: Type<unknown> }
}

export interface Type<T> {
  new(...args: any[]): T
}

export function Inject(type: Type<unknown>): (target: object, parameter: string | symbol, index: number) => void {
  if (type === undefined) {
    throw new Error('Type declaration order failure!')
  }

  return (target: any, parameter: string | symbol, index: number) => {
    const metadata: Metadata = target[METADATA_PROPERTY] ??= { parameters: {} }

    metadata.parameters[index] = type
  }
}

export class Injector {
  private readonly _instances = new Map<Type<unknown>, unknown>()

  private constructor(private readonly _dependencies: Map<Type<unknown>, Type<unknown>[]>) {
  }

  createInstance<T>(type: Type<T>): T {
    let res = this._instances.get(type) as T

    if (res === undefined) {
      res = new type(...this._dependencies.get(type)!.map(d => this.createInstance(d)))

      this._instances.set(type, res)
    }

    return res
  }

  static forService(startingPoint: Type<unknown>): Injector {
    const dependencies = new Map<Type<unknown>, Type<unknown>[]>()

    this._findDependenciesRecursive(startingPoint, dependencies)

    // TODO Identify instantiation order using a tree.
    // TODO Identify circular dependencies.

    return new Injector(dependencies)
  }

  private static _findDependenciesRecursive(type: Type<unknown>, res: Map<Type<unknown>, Type<unknown>[]>): void {
    const dependencies: Type<unknown>[] = []
    const metadata = getMetadata(type)

    if (metadata !== null) {
      for (const index in metadata.parameters) {
        dependencies.push(metadata.parameters[index])

        this._findDependenciesRecursive(metadata.parameters[index], res)
      }
    }

    res.set(type, dependencies)
  }
}

function getMetadata(type: Type<unknown>): Metadata | null {
  return (type as any)[METADATA_PROPERTY] ?? null
}
