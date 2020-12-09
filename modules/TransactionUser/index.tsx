import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Transaction from './main';
import { KalosMap } from '../ComponentsLibrary/KalosMap';
import { Place } from '@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb';

let testDest = new Place();

testDest.setStreetNumber(75);
testDest.setRoadName('Harold St');
testDest.setCity('Sydney');
testDest.setState('NS B1P 3M2');
testDest.setCountry('Canada');

ReactDOM.render(
  <>
    <Transaction userID={8418} withHeader />{' '}
    {
      <KalosMap
        isOpen
        Addresses={{ origin: [testDest], destination: testDest }}
        onDistanceCalculated={() => {}}
      />
    }
    ,
  </>,
  document.getElementById('txn-root'),
);
