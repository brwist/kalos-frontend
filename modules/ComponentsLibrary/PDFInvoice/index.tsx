import React, { FC } from 'react';

interface Props {
  serviceCallId: number;
}

export const PDFInvoice: FC<Props> = ({ serviceCallId }) => {
  return <div>PDFInvoice {serviceCallId}</div>;
};
