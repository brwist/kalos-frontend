import React from 'react';
import { TripInfoTable } from './index';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { Schema } from '../Form';
import { ExampleTitle } from '../helpers';
import { PerDiemRow } from '../../../@kalos-core/kalos-rpc/PerDiem';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <TripInfoTable perDiemRowIds={[1]} loggedUserId={101253} />

    <ExampleTitle>Default (Viewing as Chernov)</ExampleTitle>
    <TripInfoTable perDiemRowIds={[1]} loggedUserId={101275} />

    <ExampleTitle>Right-Aligned (Viewing as Chernov)</ExampleTitle>
    <TripInfoTable
      perDiemRowIds={[1]}
      loggedUserId={101275}
      textAlignment="right"
    />

    <ExampleTitle>Can Add Trips</ExampleTitle>
    <TripInfoTable perDiemRowIds={[1]} loggedUserId={101253} canAddTrips />

    <ExampleTitle>Can Delete Trips</ExampleTitle>
    <TripInfoTable perDiemRowIds={[1]} loggedUserId={101253} canDeleteTrips />
  </>
);
