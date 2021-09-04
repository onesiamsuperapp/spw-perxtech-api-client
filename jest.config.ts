import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 300000,
  testMatch: [
    '**/__tests__/**.ts',
  ],
  setupFiles: [
    'dotenv/config',
  ],
  verbose: true
}

export default config