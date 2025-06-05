module.exports = {
    displayName: 'e2e',
    testMatch: ['<rootDir>/test/**/*.e2e-spec.ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    //globalSetup: '<rootDir>/tests/e2e/_setup.ts',
    //globalTeardown: '<rootDir>/tests/e2e/_teardown.ts',
  };
  