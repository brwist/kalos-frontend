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
    <SlackMessageButton
      label="Message on slack!"
      loggedUserId={userId}
      type="regular"
    />
    <ExampleTitle>Changed outline</ExampleTitle>
    <SlackMessageButton
      label="Message on slack!"
      loggedUserId={userId}
      variant="outlined"
      type="regular"
    />
    <ExampleTitle>Autofill name to Justin Farrell</ExampleTitle>
    <SlackMessageButton
      label="Message on slack!"
      loggedUserId={userId}
      autofillName="Justin Farrell"
      type="regular"
    />
    <ExampleTitle>
      Autofill name to Justin Farrell and message to Hi!
    </ExampleTitle>
    <SlackMessageButton
      label="Message on slack!"
      loggedUserId={userId}
      autofillName="Justin Farrell"
      autofillMessage="Hi!"
      type="regular"
    />
    <ExampleTitle>Title changed (visible in form at the top)</ExampleTitle>
    <SlackMessageButton
      label="Message on slack!"
      loggedUserId={userId}
      title="Changed title"
      type="regular"
    />
    <ExampleTitle>Full Height Modal</ExampleTitle>
    <SlackMessageButton
      label="Message on slack!"
      loggedUserId={userId}
      fullHeight
      type="regular"
    />
  </>
);
