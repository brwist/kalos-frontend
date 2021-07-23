# How to Use Mocha

Mocha is a test framework. You can run it once with "yarn test", or alternatively "yarn test-watch", where it will be run in watch mode and auto-update while you write code.

# What is Chai?

Chai is an assertion library and is the reason you must use Require in most cases instead of Import. It allows for expectations to be tested against.

# What is Enzyme?

Enzyme is a Javascript testing utility for React which helps validate components are rendering correctly, etc.

# Writing Tests

When writing the tests out, ensure that you wrap all tests in a decent Describe block (or multiple of them). This helps ensure the CLI output is clean and well-kempt.

# RPCs and Testing

Because of the way our server is set up, there are a few gotchas which need to be kept in mind when testing out functionality that makes calls to the server (IE, testing Helper functions).

- Make sure to add "require('./grpc-endpoint.js')" to the top of your file - this sets up the GRPC transport so we can actually use Node (for Chai) to make calls to the dev server
- Set up the user authentication token with the ENDPOINT (from Kalos Frontend, NOT Kalos Core) and call GetToken on it before any tests which make calls to the dev server (This is partially done for you in setup.js)

# Imports and Require

For most of the test files, you should be using Require with Import due to Chai running in a NodeJS environment. The only exception to this is in various setup files where variables MUST be imported the ES6 way. For these cases, simply use an import in a file and then "require" that file (see grpc-endpoint.js as an example and its corresponding "require" call in helpers.test.ts).

The style "import ModuleName = require('module_path')" should be STRONGLY preferred in actual tests. This allows for Intellisense to work (See any of the test files to see more examples of this in action).

- Paths should be the same for Require as they are in Import
  - "import { SectionBar } from '../../../../modules/ComponentsLibrary/SectionBar/index'" is equivalent to "SectionBar.SectionBar" from "import SectionBar = require('../../../../modules/ComponentsLibrary/SectionBar/index')"

# Style Conventions

Describe and It should be used as per Mocha's guides. When testing methods and functions,

- "#" should prefix instance methods and properties
- "." should prefix static methods and properties

The structure of folders inside of the test folder should mimic the project's layout as closely as possible.

# Style for Imports

If importing a module, for example Event, try to name it "EventModule" (putting Module after the module name) unless importing from a protobuffer.

If importing from a protobuffer, for example user_pb.d.ts, try to name it "UserProto" (putting Proto after the module name).
