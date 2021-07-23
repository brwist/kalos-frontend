export {};

import Chai = require('chai');

import Helpers = require('../helpers');
import EventModule = require('@kalos-core/kalos-rpc/Event/index');
import Setup = require('./test-setup/endpoint-setup'); // ? Sets the auth token up in a one-liner

describe('helpers', () => {
  describe('.getMimeType()', () => {
    it('should return image/png when "test.png" is provided as argument', () => {
      Chai.expect(Helpers.getMimeType('test.png')).to.equal('image/png');
    });
  });
  describe('.perDiemTripMilesToUsd()', () => {
    it('should return $ 33.60 when given 60 miles', () => {
      Chai.expect(Helpers.perDiemTripMilesToUsd(60)).to.equal('$ 33.60');
    });
  });
  describe('.loadActivityLogsByFilter()', () => {
    it('should not be null if given proper arguments', () => {
      Chai.expect(
        // ? Could fill this out more later but the sort call works and isn't null so yeah
        // @ts-expect-error
        Helpers.loadActivityLogsByFilter({ page: 0, filter: {}, sort: {} }),
      ).not.to.be.null;
    });
  });

  // ! Commented because an RPC somewhere takes down dev and I don't wanna risk it atm.
  // ? Grepped to prevent execution with test-watch (so the server isn't spammed)
  // describe('RPC', () => {
  //   before(async () => {
  //     // Before any test that has an RPC in it, use this to set up the authentication token
  //     await Setup.u.GetToken('test', 'test');
  //   });
  //   describe('Client Services', () => {
  //     describe('EventClientService', () => {
  //       describe('#Get()', () => {
  //         it('should get the event with ID 1', async () => {
  //           let res;
  //           try {
  //             let req = new EventModule.Event();
  //             req.setId(1);
  //             res = await Helpers.EventClientService.Get(req);
  //           } catch (err) {
  //             console.error(
  //               `The EventClientService ran into an issue while getting the event: ${err}`,
  //             );
  //             Chai.expect.fail(
  //               `The EventClientService ran into an issue while getting the event: ${err}`,
  //             );
  //           }
  //           Chai.expect(res.getName()).to.equal('blank event');
  //         });
  //       });
  //     });
  //   });
  // });
});
