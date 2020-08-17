import React from 'react';
import ReactDOM from 'react-dom';
import { Gallery } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <Gallery title="Example Title" fileList={[]} text="Example Text" />
  </StyledPage>,
  document.getElementById('root')
);
