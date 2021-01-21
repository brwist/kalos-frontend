import React from 'react';
import { SlackMessageButton } from './index';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { Schema } from '../Form';
import { ExampleTitle } from '../helpers';
import { PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';
import { UserClientService } from '../../../helpers';

const userName1 = 'Justin Farrell';
const messageToSend = 'Test message';
const userId = 101275;

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <SlackMessageButton
      label="Message on slack!"
      userName={userName1}
      textToSend={messageToSend}
      loggedUserId={userId}
      onClick={() => {
        alert(
          `Would send a message to the user with ID ${userId} saying "${messageToSend}"`,
        );
      }}
    />
  </>
);
