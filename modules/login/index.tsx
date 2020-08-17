import React from 'react';
import ReactDOM from 'react-dom';
import { Login } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <Login />
  </StyledPage>,
  document.getElementById('root')
);
