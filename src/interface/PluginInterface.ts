export interface BasePlugin {
  name: string
  function: {
    [key: string]: () => any
  }
}