import React from 'react';
import ReactDOM from 'react-dom';
import { PDFMaker } from './main';

ReactDOM.render(
  <PDFMaker
    name="Robert Milejczak"
    dateStr="2020/02/05"
    title="Create PDF"
    amount={40.54}
    pdfType="Retrievable Receipt"
  />,
  document.getElementById('root'),
);
