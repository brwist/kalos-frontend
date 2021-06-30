const expectImport = require('chai').expect;
const getMimeType = require('../helpers.js').getMimeType;
const perDiemTripMilesToUsd = require('../helpers.js').perDiemTripMilesToUsd;
const loadActivityLogsByFilter =
  require('../helpers.ts').loadActivityLogsByFilter;
const LoadActivityLogsByFilter =
  require('../helpers.ts').LoadActivityLogsByFilter;
const milesFactor = require('../constants.ts').IRS_SUGGESTED_MILES_FACTOR;

describe('helpers', () => {
  describe('#getMimeType', () => {
    it('should return PNG', () => {
      expectImport(getMimeType('test.png')).to.equal('image/png');
    });
  });
});

describe('helpers', () => {
  describe('#perDiemTripMilesToUsd', () => {
    it('should return the correct trip miles to usd depending on the constant set up', () => {
      expectImport(perDiemTripMilesToUsd(60)).to.equal('$ 33.60');
    });
  });
});

describe('helpers', () => {
  describe('#loadActivityLogsByFilter', () => {
    it('should not be null if given proper arguments', () => {
      expectImport(loadActivityLogsByFilter({ page: 0, filter: {}, sort: {} }))
        .not.to.be.null;
    });
  });
});
