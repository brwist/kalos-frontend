import React, { FC, useState, useEffect } from 'react';
import { InvoiceClient, Invoice } from '@kalos-core/kalos-rpc/Invoice';
import { PrintPage } from '../ComponentsLibrary/PrintPage';
import { PrintHeader } from '../ComponentsLibrary/PrintHeader';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const userClient = new UserClient(ENDPOINT);
const invoiceClient = new InvoiceClient(ENDPOINT);

type Props = {
  invoiceId: number;
};

const InvoiceViewer: FC<Props> = ({ invoiceId }: Props) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  useEffect(() => {
    (async () => {
      await userClient.GetToken('test', 'test');
      const req = new Invoice();
      // 28080,34333, 86246
      req.setId(28080);
      const result = await invoiceClient.Get(req);
      console.log(result);
    })();
  }, []);
  return (
    <PrintPage visible downloadPdfFilename="Invoice">
      <PrintHeader title="Print Header" />
      The undersigned has authority to order the above labor and materials on behalf of the above named purchaser. The labor and materials described above have been completely and
      satisfactorily performed and furnished. Kalos Services is not liable for any defects in labor or material unless the purchaser gives written notice of such defects within 30 days from
      the date of this contract. Payment in full is due upon receipt of this invoice and payable upon completion of work. The purchaser should be aware that under Florida law, Kalos
      Services has the right to file a mechanics lien if payment is not made per the terms of this document. Purchaser agrees to pay all costs of collection including a reasonable
      attorney's fee, in case this contract is not paid in full when due and the same is placed in the hands of an attorney for collection, foreclosure or repossession, whether suit be
      brought or not. All delinquent payments shall bear a service charge of 2% per month until paid. Selling price of all parts and equipment are on an exchange basis with the purchasers
      old parts and equipment. Warranty on all parts per manufacturers warranty policies 90 day labor guarantee: only on that portion previously serviced. If my payment is by check and
      my check is returned for any reason, I authorize the merchant to electronically debit my account for the amount of this item plus any fees allowed by law.
    </PrintPage>
  );
};

export default InvoiceViewer;
