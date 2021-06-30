const expectImport = require('chai').expect;
const getMimeType = require('../helpers.ts').getMimeType;
const perDiemTripMilesToUsd = require('../helpers.ts').perDiemTripMilesToUsd;
const loadActivityLogsByFilter =
  require('../helpers.ts').loadActivityLogsByFilter;
const LoadActivityLogsByFilter =
  require('../helpers.ts').LoadActivityLogsByFilter;
const milesFactor = require('../constants.ts').IRS_SUGGESTED_MILES_FACTOR;
const EventType = require('@kalos-core/kalos-rpc/Event/index.ts').Event;
const EventClient = require('@kalos-core/kalos-rpc/Event').EventClient;
const UserClient = require('@kalos-core/kalos-rpc/User').UserClient;
const ENDPOINT = require('../constants.ts').ENDPOINT;
require('./grpc-endpoint.js');

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
  describe('#EventClientService.Get', () => {
    it('should work correctly for id 1', async () => {
      let res;
      // Can go into setup function
      const EventClientService = new EventClient(ENDPOINT);
      const u = new UserClient(ENDPOINT);
      await u.GetToken('test', 'test');

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
