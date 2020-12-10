module.exports = {
    "roots": [
      "<rootDir>/modules"
    ],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx|jsx)$": "ts-jest",
    },
    "transformIgnorePatterns": ['/node_modules\/(?!@kalos-core)(.*)']

  }