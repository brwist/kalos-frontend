import React from 'react';
import ReactDOM from 'react-dom';
import { SearchIndex } from './main';

ReactDOM.render(
  <SearchIndex loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
