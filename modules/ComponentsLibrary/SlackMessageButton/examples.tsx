import React from 'react';
import { SlackMessageButton } from './index';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { Schema } from '../Form';
import { ExampleTitle } from '../helpers';
import { PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <SlackMessageButton label="Message on slack!" userId={10010} />
  </>
);
