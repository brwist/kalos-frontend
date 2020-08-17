import React from 'react';
import ReactDOM from 'react-dom';
import { LoginHelper } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <LoginHelper />
  </StyledPage>,
  document.getElementById('root')
);
