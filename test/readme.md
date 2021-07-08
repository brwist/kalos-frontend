# How to Use Mocha

Mocha is a test framework. You can run it once with "yarn test", or alternatively "yarn test-watch", where it will be run in watch mode and auto-update while you write code.

# What is Chai?

Chai is an assertion library and is the reason you must use Require in most cases instead of Import. It allows for expectations to be tested against.

# What is Enzyme?

Enzyme is a Javascript testing utility for React which helps validate components are rendering correctly, etc.

# RPCs and Testing

Because of the way our server is set up, there are a few gotchas which need to be kept in mind when testing out functionality that makes calls to the server (IE, testing Helper functions).

- Make sure to add "require('./grpc-endpoint.js')" to the top of your file - this sets up the GRPC transport so we can actually use Node (for Chai) to make calls to the dev server
- Set up the user authentication token with the ENDPOINT (from Kalos Frontend, NOT Kalos Core) and call GetToken on it before any tests which make calls to the dev server (This is partially done for you in setup.js)

# Imports and Require

For most of the test files, you should be using Require instead of Import due to Chai running in a NodeJS environment. The only exception to this is in various setup files where variables MUST be imported. For these cases, simply use an import in a file and then "require" that file (see grpc-endpoint.js as an example and its corresponding "require" call in helpers.test.ts).

- Paths should be the same for Require as they are in Import
  - "import { SectionBar } from '../../../../modules/ComponentsLibrary/SectionBar/index'" is equivalent to "require('../../../../modules/ComponentsLibrary/SectionBar/index').SectionBar"

# Why "expectImport" instead of "expect"?

For now, it conflicts with Jest and I am honestly not sure why. It'll hopefully be fixed very soon.

# Style Conventions

Describe and It should be used as per Mocha's guides. When testing methods and functions,

- "#" should prefix instance methods and properties
- "." should prefix static methods and properties

The structure of folders inside of the test folder should mimic the project's layout as closely as possible.
