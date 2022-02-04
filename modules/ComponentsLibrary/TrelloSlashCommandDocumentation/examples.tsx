import React from 'react';
import { TrelloSlashCommandDocumentation } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <TrelloSlashCommandDocumentation loggedUserId={8418} />
  </>
);
