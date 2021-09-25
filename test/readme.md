# How to Use Mocha

Mocha is a test framework. You can run it once with "yarn test", or alternatively "yarn test-watch", where it will be run in watch mode and auto-update while you write code.

# What is Chai?

Chai is an assertion library and is the reason you must use Require in most cases instead of Import. It allows for expectations to be tested against.

# What is Enzyme?

Enzyme is a Javascript testing utility for React which helps validate components are rendering correctly, etc.

# Writing Tests

When writing the tests out, ensure that you wrap all tests in a decent Describe block (or multiple of them). This helps ensure the CLI output is clean and legible.
See more about Describe, It and the various hooks here: https://samwize.com/2014/02/08/a-guide-to-mochas-describe-it-and-setup-hooks/

# RPCs and Testing

For now, be careful with this functionality - it can take down the dev server and is more along the lines of integration testing.

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

Leave tests that have not been touched in a "skipped" state rather than failing (you can do this by just not providing a callback for an it function, or by doing it.skip). This keeps the output clean and free from "Not Implemented" errors, and is also the recommended way to handle things by the Mocha team.

# Style for Imports

If importing a module, for example Event, try to name it "EventModule" (putting Module after the module name) unless importing from a protobuffer.

If importing from a protobuffer, for example user_pb.d.ts, try to name it "UserProto" (putting Proto after the module name).

# General Tips

If you cannot stub a certain server call with Sinon and cannot figure out why, check to see if the call is try-catched in the relevant module. If it isn't, that may clue you in on issues (we should strive to have full try-catch error handling in our modules anyway).

Sometimes module wrappers need to be updated over time to resolve promises for mocked server calls (for example, a BatchGet call). For this, I have created a function in `test-constants/constants.ts` called `ReRenderAfterLoad`. All it does is wait for 1 millisecond for those promises to resolve, but it works (you have to `await` it)!

I will be utilizing Behavior Driven Development with future modules I produce, you should look into it! It may interest you and fit your style as well :)

# A Quick Note About Stubbing Client Service Calls with Sinon

I have included a `SetupStubs` function inside of `test-setup/stubs.ts` that can mock out any calls to the dev server. However, for existing modules especially, it may require a little bit of modification of the module (only a little though!).

Since stubs work by effectively replacing the function call with another one at test-time, they need to come from a single source of truth. I have made this single source of truth Helpers - inside Helpers, almost every client service is exported. These are stubbed inside `stubs.ts` when `SetupStubs` is called. As a result, if a module mocks a client itself and uses that to make calls to the server, the stub will not work properly (and to properly stub it, you need a reference to the function, therefore it would need to be exported).

This would quickly become messy and break encapsulation, so I instead suggest that we just change the code in those modules to use the Client Services inside of Helpers (for example, instead of `const clientService = new ClientService(ENDPOINT)`, we would just `import {ClientService} from '../helpers'` and then call the functions directly on that).

Stubbing Client Services with Sinon is also incredibly easy. Simply put something similar to this in a before() call:

```javascript
// "Stubs" in this case is an import of 'test-setup/stubs'
Stubs.setupStubs(
  'UserClientService',
  'loadUserById',
  userThatWouldResult, // The result that will be returned when the function resolves.
  101253, // This is the argument to be supplied to the function, if any. Optional.
);
```

... and then be sure to put this in an after() call:

```javascript
Stubs.restoreStubs();
```

I like to put the before and after calls on a describe block that surrounds some it() calls. This ensures that the data is stubbed out the same for the entire module during testing.

# Why do I keep getting an error similar to "Error: route /TransactionActivityService/BatchGet requires authentication - rpc error: code = Unauthenticated desc = missing authorization token"?

This is because there is a function somewhere (most likely in the component loading cycle or the methods that get called by things you are testing) that must be stubbed properly.
