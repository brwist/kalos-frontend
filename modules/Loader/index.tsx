import React from 'react';
import ReactDOM from 'react-dom';
import { Loader } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <Loader />
  </StyledPage>,
  document.getElementById('root'),
);
