// NOTE these are all tests to check the health of our overall project and to ensure accurate results. They will not run in watch mode, as they run
// RPCs.

export {};
const Setup = require('./test-setup/endpoint-setup'); // ? Sets the auth token up in a one-liner

describe('system', () => {
  describe('connection', () => {
    // describe('RPC', () => {
    //   it('should be able to set up the user authentication token', async () => {
    //     try {
    //       await Setup.u.GetToken('test', 'test');
    //     } catch (err) {
    //       console.error(
    //         `An error occurred while getting the user authentication token during a system connection test: ${err}`,
    //       );
    //     }
    //   });
    // });
  });
});
