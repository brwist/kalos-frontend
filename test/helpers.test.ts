const expectImport = require('chai').expect;
const getMimeType = require('../helpers.ts').getMimeType;
const perDiemTripMilesToUsd = require('../helpers.ts').perDiemTripMilesToUsd;
const loadActivityLogsByFilter =
  require('../helpers.ts').loadActivityLogsByFilter;
const LoadActivityLogsByFilter =
  require('../helpers.ts').LoadActivityLogsByFilter;
const milesFactor = require('../constants.ts').IRS_SUGGESTED_MILES_FACTOR;

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
