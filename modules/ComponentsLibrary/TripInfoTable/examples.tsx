import React from 'react';
import { TripInfoTable } from './index';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { Schema } from '../Form';
import { ExampleTitle } from '../helpers';
import { PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';

export default () => (
  <>
    <ExampleTitle>Normal</ExampleTitle>

    <TripInfoTable
      perDiemRowIds={[1]}
      loggedUserId={101253}
      canAddTrips
    ></TripInfoTable>
  </>
);
