var expectImport = require('chai').expect;
var mimeType = require('../helpers.js').getMimeType;

describe('helpers', () => {
  describe('#getMimeType', () => {
    it('should return PNG', () => {
      expectImport(mimeType('test.png')).to.equal('image/png');
    });
  });
});
