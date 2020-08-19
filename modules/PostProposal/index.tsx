import React from 'react';
import ReactDOM from 'react-dom';
import { PostProposal } from './main';

ReactDOM.render(
  <PostProposal userID={4375} jobNumber={99893} userName="Bob" withHeader />,
  document.getElementById('root'),
);
