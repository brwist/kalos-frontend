import React from 'react';
import ReactDOM from 'react-dom';
import { Search } from './main';

ReactDOM.render(
  <Search loggedUserId={101253} withHeader padding={1} />,
  document.getElementById('root'),
);
