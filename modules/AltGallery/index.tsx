import React from 'react';
import ReactDOM from 'react-dom';
import { Gallery } from '../ComponentsLibrary/Gallery';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <Gallery
      title="Alt Gallery"
      text="Lorem ipsum..."
      fileList={[]}
      transactionID={8398}
    />
  </StyledPage>,
  document.getElementById('root'),
);
