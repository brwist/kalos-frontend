import React from 'react';
import SearchIcon from '@material-ui/icons/SearchSharp';
import { PDFMaker } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Retrievable Receipt</ExampleTitle>
    <PDFMaker
      name="Robert Milejczak"
      dateStr="2020/02/05"
      title="Create PDF"
      amount={140.54}
      pdfType="Missing Receipt"
      onCreate={console.log}
      vendor="Example Vendor"
      confirmText="Custom confirmation"
    />
    <ExampleTitle>
      Retrievable Receipt with jobNumber, icon and confirmText
    </ExampleTitle>
    <PDFMaker
      name="Robert Milejczak"
      dateStr="2020/02/05"
      title="Create PDF"
      amount={40.54}
      pdfType="Retrievable Receipt"
      onCreate={console.log}
      vendor="Example Vendor"
      confirmText="OK"
      jobNumber="11223344"
      icon={<SearchIcon />}
    />
  </>
);
