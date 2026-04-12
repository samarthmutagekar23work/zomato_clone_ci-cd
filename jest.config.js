module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/index.{js,jsx}',
    '!src/reportWebVitals.js',
    '!src/setupTests.js'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 50,
      lines: 65,
      statements: 65
    }
  },
  coverageReporters: ['lcov', 'text', 'text-summary'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy'
  }
};
