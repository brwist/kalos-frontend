import React from 'react';
import { CreateTrelloBoard } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <CreateTrelloBoard loggedUserId={8418} />
  </>
);
