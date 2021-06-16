import { Container } from '../Container'

export async function activeProvider (container: Container, data: any) {
  return Promise.all(
    container.providers.map(async (provider) => {
      await provider.loadFile(data)
    }),
  )
}