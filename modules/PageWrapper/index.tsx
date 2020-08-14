import React from 'react';
import ReactDOM from 'react-dom';
import { PageWrapper } from './main';

ReactDOM.render(
  <PageWrapper userID={101253}>
    <div style={{ padding: 16, textAlign: 'center' }}>
      Lorem ipsum...
      <div style={{ fontSize: 280 }}>👍</div>
    </div>
  </PageWrapper>,
  document.getElementById('root')
);
