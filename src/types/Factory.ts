import { File } from "fs-recursive"

export type EnvironmentElement = {
	[key: string]: string | string[] | EnvironmentElement
}

export type Environment = {
  type: string
  path: string
  content: EnvironmentElement
}

export type EnvironmentType = 'env' | 'json' | 'yml' | 'yaml'

export interface EnvironmentFactory {
	env: (file: File) => Promise<EnvironmentElement>,
	json: (file: File) => Promise<EnvironmentElement>,
	yml: (file: File) => Promise<EnvironmentElement>,
	yaml: (file: File) => Promise<EnvironmentElement>,
}
