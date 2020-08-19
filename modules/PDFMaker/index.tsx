import React from 'react';
import ReactDOM from 'react-dom';
import { PDFMaker } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <PDFMaker
      name="Robert Milejczak"
      dateStr="2020/02/05"
      title="Create PDF"
      amount={40.54}
      pdfType="Retrievable Receipt"
    />
  </StyledPage>,
  document.getElementById('root'),
);
