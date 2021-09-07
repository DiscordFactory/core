import ContainerManager from '../Container'

export function activeProvider (container: ContainerManager, data: any) {
  return Promise.all(
    container.providers.map(async (provider) => {
      await provider.load(data)
    }),
  )
}