import React from 'react';
import { SlackMessageButton } from './index';
import { ExampleTitle } from '../helpers';

const userId = 101275; // Pavel Chernov's ID

export default () => (
  <>
    <h1 style={{ color: 'red' }}>
      NOTICE: This will actually send messages to people at the moment. Do not
      use until this message is gone.
    </h1>
    <ExampleTitle>Default</ExampleTitle>
    <SlackMessageButton label="Message on slack!" loggedUserId={userId} />
    <ExampleTitle>Using a Form to get details</ExampleTitle>
  </>
);
