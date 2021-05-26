export type EnvironmentFactory = {
  type: string
  path: string
  content: string
}

export type EnvironmentType = 'env' | 'json' | 'yaml'