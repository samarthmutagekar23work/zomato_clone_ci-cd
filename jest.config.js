module.exports = {
  collectCoverageFrom: [
    'src/context/**/*.{js,jsx}',
    'src/components/**/*.{js,jsx}',
    'src/data/**/*.{js,jsx}',
    'src/pages/**/*.{js,jsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 80,
      statements: 80
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
