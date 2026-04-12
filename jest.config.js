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
      branches: 20,
      functions: 15,
      lines: 25,
      statements: 25
    }
  },
  coverageReporters: ['lcov', 'text', 'text-summary'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).{js,jsx}'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-router|react-router-dom)/)'
  ]
};
