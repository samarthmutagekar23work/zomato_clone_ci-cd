module.exports = {
  collectCoverageFrom: [
    'src/context/**/*.{js,jsx}',
    'src/components/FilterBar/**/*.{js,jsx}',
    'src/components/Accordian/**/*.{js,jsx}',
    'src/components/AccContainer/**/*.{js,jsx}',
    'src/components/Card/**/*.{js,jsx}',
    'src/components/Cities/**/*.{js,jsx}',
    'src/components/Collections/**/*.{js,jsx}',
    'src/components/RestaurantCard/**/*.{js,jsx}',
    'src/components/SearchBar/**/*.{js,jsx}',
    'src/components/CTA/**/*.{js,jsx}',
    'src/components/Footer/**/*.{js,jsx}',
    'src/data/**/*.{js,jsx}'
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
