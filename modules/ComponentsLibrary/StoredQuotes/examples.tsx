import React from 'react';
import { StoredQuotes } from './';

export default () => (
  <StoredQuotes onSelect={storedQuote => console.log(storedQuote)} />
);
