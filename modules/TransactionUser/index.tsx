import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Transaction from './main';
import { KalosMap } from '../ComponentsLibrary/KalosMap';
import { Place } from '@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb';

let testDest = new Place(),
  testOrigin = new Place();

testDest.setStreetNumber(75);
testDest.setRoadName('Harold St');
testDest.setCity('Sydney');
testDest.setState('NS B1P 3M2');
testDest.setCountry('Canada');

testOrigin.setStreetNumber(15400);
testOrigin.setRoadName('Foothill Blvd');
testOrigin.setCity('San Leandro');
testOrigin.setState('California');
testOrigin.setCountry('US');

/*

testOrigin.setStreetNumber(201);
testOrigin.setRoadName('Circle Park Dr');
testOrigin.setCity('Sebring');
testOrigin.setState('Florida');
testOrigin.setCountry('US');

*/
/*

testOrigin.setStreetNumber(900);
testOrigin.setRoadName('S Beretania St');
testOrigin.setCity('Honolulu');
testOrigin.setState('Hawaii');
testOrigin.setCountry('US');

*/

ReactDOM.render(
  <>
    <Transaction userID={8418} withHeader />{' '}
    {
      <KalosMap
        isOpen
        Addresses={{ origin: [testOrigin], destination: testDest }}
        onDistanceCalculated={() => {}}
      />
    }
    ,
  </>,
  document.getElementById('txn-root'),
);
