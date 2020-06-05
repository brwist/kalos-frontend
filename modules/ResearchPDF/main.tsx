import React, { useRef, useState, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PDFClient, HTML } from '@kalos-core/kalos-rpc/PDF';
import { Button } from '../ComponentsLibrary/Button';
import { ENDPOINT, BUCKET } from '../../constants';
import ComponentToPrint from './components/ComponentToPrint';

const pdfClient = new PDFClient(ENDPOINT);

const ResearchPDF = () => {
  const [html, setHtml] = useState('');
  const [url, setUrl] = useState('');
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleGetPDF = useCallback(async () => {
    const req = new HTML();
    req.setData(componentRef?.current?.outerHTML);
    req.setKey('filename.pdf');
    req.setBucket(BUCKET);
    const url = await pdfClient.Create(req);
    setUrl(url);
  }, [componentRef]);

  return (
    <div>
      <ComponentToPrint ref={componentRef} />
      <Button label="Print" onClick={handlePrint} />
      <hr />
      <Button label="Get PDF File url" onClick={handleGetPDF} />
      {url && (
        <a href={url} target="_blank" rel="noreferrer">filename.pdf</a>
      )}
      <hr />
      <Button label="Get HTML string" onClick={() => setHtml(componentRef?.current?.outerHTML)} />
      {Boolean(html) && (
        <div>{html}</div>
      )}
    </div>
  );
};

export default ResearchPDF;
