import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 300000,
  testMatch: [
    '<rootDir>/integration/**/**.test.ts',
  ],
  setupFiles: [
    'dotenv/config',
  ]
}

export default config