import React from 'react';
import { KalosMap } from './';
import { Place } from '../../../@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb';

// Setting these up here for convenience - set them up in code where you would like

let testOrigin = new Place(),
  testDest = new Place();

testOrigin.setStreetNumber(201);
// It will try to guess street names if you accidentally
// omit details. Tested with "Circle Park" instead and
// it still worked
testOrigin.setRoadName('Circle Park Dr');
testOrigin.setCity('Sebring');
testOrigin.setState('Florida'); // You can abbreviate state names, IE 'FL'
testOrigin.setCountry('US');

testDest.setStreetNumber(75);
testDest.setRoadName('Harold St');
testDest.setCity('Sydney');
testDest.setState('NS B1P 3M2');
testDest.setCountry('Canada');

export default () => (
  <>
    <KalosMap
      isOpen
      Addresses={{ origin: [testOrigin], destination: testDest }}
      onDistanceCalculated={(dist: any) => {
        console.log('Woo hoo I got a distance: ' + dist);
      }}
    />
  </>
);
