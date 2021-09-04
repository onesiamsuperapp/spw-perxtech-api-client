import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 300000,
  testMatch: [
    '**/__tests__/services/**.ts',
    '**/__tests__/services-core/**.ts'
  ],
  verbose: true
}

export default config