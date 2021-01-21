import React from 'react';
import { SlackMessageButton } from './index';
import { ExampleTitle } from '../helpers';

const userId = 101275; // Pavel Chernov's ID

export default () => (
  <>
    <h1 style={{ color: 'red' }}>
      NOTICE: This will actually send messages to people.
    </h1>
    <ExampleTitle>Default</ExampleTitle>
    <SlackMessageButton label="Message on slack!" loggedUserId={userId} />
    <ExampleTitle>Changed outline</ExampleTitle>
    <SlackMessageButton
      label="Message on slack!"
      loggedUserId={userId}
      variant="outlined"
    />
    <ExampleTitle>Autofill name to Justin Farrell</ExampleTitle>
    <SlackMessageButton
      label="Message on slack!"
      loggedUserId={userId}
      autofillName="Justin Farrell"
    />
    <ExampleTitle>
      Autofill name to Justin Farrell and message to "Hi!"
    </ExampleTitle>
    <SlackMessageButton
      label="Message on slack!"
      loggedUserId={userId}
      autofillName="Justin Farrell"
      autofillMessage="Hi!"
    />
  </>
);
