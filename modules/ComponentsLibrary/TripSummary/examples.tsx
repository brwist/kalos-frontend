import React from 'react';
import { TripSummary } from './index';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { Schema } from '../Form';
import { ExampleTitle } from '../helpers';
import { PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';

export default () => (
  <>
    <ExampleTitle>Normal</ExampleTitle>

    <TripSummary perDiemRowIds={[1]} loggedUserId={101275}></TripSummary>
  </>
);
