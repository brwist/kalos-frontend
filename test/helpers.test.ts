export {};

const expect = require('chai').expect;

const getMimeType = require('../helpers.ts').getMimeType;
const perDiemTripMilesToUsd = require('../helpers.ts').perDiemTripMilesToUsd;
const loadActivityLogsByFilter =
  require('../helpers.ts').loadActivityLogsByFilter;
const EventType = require('@kalos-core/kalos-rpc/Event/index.ts').Event; // ! These have to be "require" not "import" because Chai runs in a Node environment
// ! but are otherwise the same. This is named "EventType" instead of Event because of a name conflict with JS Event, you can keep the name the same for other types
const EventClientService = require('../helpers.ts').EventClientService;
const Setup = require('./test-setup/endpoint-setup'); // ? Sets the auth token up in a one-liner

describe('helpers', () => {
  describe('.getMimeType()', () => {
    it('should return image/png when "test.png" is provided as argument', () => {
      expect(getMimeType('test.png')).to.equal('image/png');
    });
  });
  describe('.perDiemTripMilesToUsd()', () => {
    it('should return $ 33.60 when given 60 miles', () => {
      expect(perDiemTripMilesToUsd(60)).to.equal('$ 33.60');
    });
  });
  describe('.loadActivityLogsByFilter()', () => {
    it('should not be null if given proper arguments', () => {
      expect(loadActivityLogsByFilter({ page: 0, filter: {}, sort: {} })).not.to
        .be.null;
    });
  });

  // ? Grepped to prevent execution with test-watch (so the server isn't spammed)
  describe('RPC', () => {
    before(async () => {
      // Before any test that has an RPC in it, use this to set up the authentication token
      await Setup.u.GetToken('test', 'test');
    });
    describe('Client Services', () => {
      describe('EventClientService', () => {
        describe('#Get()', () => {
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
              expect.fail(
                `The EventClientService ran into an issue while getting the event: ${err}`,
              );
            }
            expect(res.getName()).to.equal('blank event');
          });
        });
      });
    });
  });
});
