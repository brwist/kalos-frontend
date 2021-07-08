const getMimeType = require('../helpers.ts').getMimeType;
const perDiemTripMilesToUsd = require('../helpers.ts').perDiemTripMilesToUsd;
const loadActivityLogsByFilter =
  require('../helpers.ts').loadActivityLogsByFilter;
const EventType = require('@kalos-core/kalos-rpc/Event/index.ts').Event; // ! These have to be "require" not "import" because Chai runs in a Node environment
// ! but are otherwise the same. This is named "EventType" instead of Event because of a name conflict with JS Event, you can keep the name the same for other types
const EventClientService = require('../helpers.ts').EventClientService;
const Setup = require('./setup.js'); // ? Sets the auth token up in a one-liner
require('./grpc-endpoint.js'); // ? Required to run tests with RPCs in Mocha (because Mocha runs in a Node environment)
export const expectImport = require('./chai-setup.js').expectImport;

describe('helpers', () => {
  describe('#getMimeType', () => {
    it('should return image/png when "test.png" is provided as argument', () => {
      expectImport(getMimeType('test.png')).to.equal('image/png');
    });
  });
  describe('#perDiemTripMilesToUsd', () => {
    it('should return $ 33.60 when given 60 miles', () => {
      expectImport(perDiemTripMilesToUsd(60)).to.equal('$ 33.60');
    });
  });
  describe('#loadActivityLogsByFilter', () => {
    it('should not be null if given proper arguments', () => {
      expectImport(loadActivityLogsByFilter({ page: 0, filter: {}, sort: {} }))
        .not.to.be.null;
    });
  });
});

describe('rpc', () => {
  before(async () => {
    // Before any test that has an RPC in it, use this
    await Setup.u.GetToken('test', 'test');
  });
  describe('#EventClientService.Get', () => {
    it('should get the event with ID 1', async () => {
      let res;
      try {
        let req = new EventType();
        req.setId(1);
        res = await EventClientService.Get(req);
      } catch (err) {
        console.error(
          `The EventClientService ran into an issue while getting the event: ${err}`,
        );
        expectImport.fail(
          `The EventClientService ran into an issue while getting the event: ${err}`,
        );
      }
      expectImport(res.getName()).to.equal('blank event');
    });
  });
});
