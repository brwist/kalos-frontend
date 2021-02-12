module.exports = {
  roots: ['<rootDir>/modules', '<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx|jsx)$': 'babel-jest',
    // jest-transform-stub allows compatibility between less files and jest
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@kalos-core)',
  ],
};
