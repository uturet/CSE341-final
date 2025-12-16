/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
