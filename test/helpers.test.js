// import {expect} from 'chai'
// import * as helpers from '../helpers.js' 

var expect = require('chai').expect
var mimeType = require('../helpers.js').getMimeType

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should flat out work', function() { 
      
      expect(1).to.equal(1)
    });
  });
}); 

describe('helpers', () => {
  describe('#getMimeType', () => {  
    it('should return PNG', () => {
      expect(mimeType('test.png').to.equal('PNG'))
    })
  })
})