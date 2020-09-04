import React from 'react';
import ReactDOM from 'react-dom';
import { AltGallery } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <AltGallery
      title="Alt Gallery"
      text="Lorem ipsum..."
      fileList={[]}
      transactionID={8398}
    />
  </StyledPage>,
  document.getElementById('root'),
);
