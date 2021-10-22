import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
  ],
  coverageReporters: ['lcov'],
}

export default config
