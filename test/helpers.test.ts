var expectImport = require('chai').expect;
var getMimeType = require('../helpers.js').getMimeType;
var perDiemTripMilesToUsd = require('../helpers.js').perDiemTripMilesToUsd;
var milesFactor = require('../constants.ts').IRS_SUGGESTED_MILES_FACTOR;

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
