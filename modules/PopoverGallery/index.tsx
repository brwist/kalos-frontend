import React from 'react';
import ReactDOM from 'react-dom';
import { PopoverGallery } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <PopoverGallery fileList={[]} text="Example Text" title="Example Title" />
  </StyledPage>,
  document.getElementById('root')
);
