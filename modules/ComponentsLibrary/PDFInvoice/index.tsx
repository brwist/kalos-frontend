import React, { FC, useEffect, useState, useCallback } from 'react';
import { PrintPage } from '../PrintPage';
import { InvoiceClientService, loadEventById } from '../../../helpers';
import { PrefabKalosInfo } from './PrefabKalosInfo';
import { PrefabPropertyInfo } from './PrefabPropertyInfo';
import { PrefabPayables } from './PrefabPayables';
import './styles.scss';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Invoice } from '@kalos-core/kalos-rpc/Invoice';
import { Alert } from '../Alert';

interface Props {
  serviceCallId: number;
  contractId: number;
  userId: number;
  onFileCreated?: (file: Uint8Array) => any;
}

// For the commented code:
// const border = '1px solid #000';

export const PDFInvoice: FC<Props> = ({
  serviceCallId,
  contractId,
  userId,
  onFileCreated,
}) => {
  const [event, setEvent] = useState<Event>();
  const [invoice, setInvoice] = useState<Invoice>();
  const [error, setError] = useState<string>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const getInvoice = useCallback(async () => {
    try {
      let req = new Invoice();
      req.setContractId(contractId);
      req.setUserId(userId);
      let res = await InvoiceClientService.Get(req);
      setInvoice(res);
      if (!res) {
        console.error('No invoice to get services performed from. ');
        setError(
          `An error occurred: no invoice found for the contract with id: ${contractId} and user with id: ${userId}`,
        );
      }
      return res;
    } catch (err) {
      console.error(`An error occurred while getting an invoice: ${err}`);
    }
  }, [contractId, userId]);
  const load = useCallback(async () => {
    const event = await loadEventById(serviceCallId);
    await getInvoice();
    setEvent(event);
  }, [getInvoice, serviceCallId]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [load, loaded]);
  return (
    <>
      {error && (
        <Alert
          title="Error"
          open={error !== undefined}
          onClose={() => setError(undefined)}
        >
          {error}
        </Alert>
      )}
      <PrintPage
        downloadPdfFilename="lorem_ipsum_1"
        onFileCreated={onFileCreated}
      >
        {event && invoice && (
          <div className="wrapper" style={{ height: 1100 }}>
            <PrefabKalosInfo />
            <PrefabPropertyInfo event={event} />
            <PrefabPayables invoice={invoice} />
            <div className="footer">
              <div
                className="signature"
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  textAlign: 'justify',
                  width: '100%',
                }}
              >
                {`The undersigned has authority to order the above labor and
              materials on behalf of the above named purchaser. The labor and
              materials described above have been completely and satisfactorily
              performed and furnished. Kalos Services is not liable for any
              defects in labor or material unless the purchaser gives written 
              notice of such defects within 30 days from the date of this
              contract. Payment in full is due upon receipt of this invoice and
              payable upon completion of work. The purchaser should be aware
              that under Florida law, Kalos Services has the right to file a
              mechanics lien if payment is not made per the terms of this
              document. Purchaser agrees to pay all costs of collection
              including a reasonable attorney's fee, in case this contract is
              not paid in full when due and the same is placed in the hands of
              an attorney for collection, foreclosure or repossession, whether
              suit be brought or not. All delinquent payments shall bear a
              service charge of 2% per month until paid. Selling price of all
              parts and equipment are on an exchange basis with the purchasers
              old parts and equipment. Warranty on all parts per manufacturers
              warranty policies 90 day labor guarantee: only on that portion
              previously serviced. If my payment is by check and my check is
              returned for any reason, I authorize the merchant to
              electronically debit my account for the amount of this item plus
              any fees allowed by law.`}
              </div>
            </div>
          </div>
        )}
        {/* {event && (
        <div className="PDFInvoice">
          <table width="100%" style={{ borderTop: border }}>
            <tbody>
              <tr>
                <td>
                  <strong>Notes:</strong>
                  <br />
                  {event.getNotes()}
                </td>
              </tr>
            </tbody>
          </table>
          <table cellPadding={0} cellSpacing={0} width="100%">
            <tbody>
              <tr>
                <th
                  style={{
                    borderTop: border,
                    borderRight: border,
                  }}
                  align="left"
                >
                  Service(s) Performed
                </th>
                <th
                  style={{
                    borderTop: border,
                    width: 120,
                  }}
                >
                  Total Amount
                </th>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: border,
                    borderRight: border,
                  }}
                >
                  {event.getServicesperformedrow1()}
                </td>
                <td
                  style={{
                    borderTop: border,
                  }}
                >
                  {event.getTotalamountrow1()}&nbsp;
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: border,
                    borderRight: border,
                  }}
                >
                  {event.getServicesperformedrow2()}
                </td>
                <td
                  style={{
                    borderTop: border,
                  }}
                >
                  {event.getTotalamountrow2()}&nbsp;
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: border,
                    borderRight: border,
                  }}
                >
                  {event.getServicesperformedrow3()}
                </td>
                <td
                  style={{
                    borderTop: border,
                  }}
                >
                  {event.getTotalamountrow3()}&nbsp;
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: border,
                    borderRight: border,
                  }}
                >
                  {event.getServicesperformedrow4()}
                </td>
                <td
                  style={{
                    borderTop: border,
                  }}
                >
                  {event.getTotalamountrow4()}&nbsp;
                </td>
              </tr>
            </tbody>
          </table>
          <table width="100%" style={{ borderTop: border }}>
            <tbody>
              <tr>
                <td></td>
                <td style={{ width: 220 }}>
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td style={{ width: 120 }}>
                          <strong>Payment Type:</strong>
                        </td>
                        <td style={{ width: 250, borderBottom: border }}>
                          {event.getLogPaymentType()}&nbsp;
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Payment Status:</strong>
                        </td>
                        <td style={{ borderBottom: border }}>
                          {event.getLogPaymentStatus()}&nbsp;
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td></td>
                <td style={{ width: 220 }}>
                  <table width="100%" cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td
                          style={{ borderLeft: border, borderBottom: border }}
                        >
                          <strong>Total</strong>
                        </td>
                        <td
                          style={{
                            borderLeft: border,
                            borderBottom: border,
                            borderRight: border,
                            width: 120,
                          }}
                        >
                          {event.getMaterialTotal()}&nbsp;
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            width="100%"
            cellSpacing={0}
            cellPadding={0}
            style={{ borderTop: border }}
          >
            <tbody>
              <tr>
                <td valign="top">
                  <strong>System Type:</strong>
                </td>
                <td valign="top" style={{ width: 160, borderLeft: border }}>
                  <table width="100%" cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Compressor Amps:</strong>{' '}
                          {event.getCompressorAmps()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Condensing Fan Amps:</strong>{' '}
                          {event.getCondensingFanAmps()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Suction Pressure:</strong>{' '}
                          {event.getSuctionPressure()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Head Pressure:</strong>{' '}
                          {event.getHeadPressure()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Return Temperature:</strong>{' '}
                          {event.getReturnTemperature()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Supply Temperature:</strong>{' '}
                          {event.getSupplyTemperature()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Subcool:</strong> {event.getSubcool()}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Superheat:</strong> {event.getSuperheat()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table
            cellPadding={5}
            width="100%"
            style={{ fontSize: 9, borderTop: border }}
          >
            <tbody>
              <tr>
                <td>
                  {`The undersigned has authority to order the above labor and
                  materials on behalf of the above named purchaser. The labor
                  and materials described above have been completely and
                  satisfactorily performed and furnished. Kalos Services is not
                  liable for any defects in labor or material unless the
                  purchaser gives written notice of such defects within 30 days
                  from the date of this contract. Payment in full is due upon
                  receipt of this invoice and payable upon completion of work.
                  The purchaser should be aware that under Florida law, Kalos
                  Services has the right to file a mechanics lien if payment is
                  not made per the terms of this document. Purchaser agrees to
                  pay all costs of collection including a reasonable attorney's
                  fee, in case this contract is not paid in full when due and
                  the same is placed in the hands of an attorney for collection,
                  foreclosure or repossession, whether suit be brought or not.
                  All delinquent payments shall bear a service charge of 2% per
                  month until paid. Selling price of all parts and equipment are
                  on an exchange basis with the purchasers old parts and
                  equipment. Warranty on all parts per manufacturers warranty
                  policies 90 day labor guarantee: only on that portion
                  previously serviced. If my payment is by check and my check is
                  returned for any reason, I authorize the merchant to
                  electronically debit my account for the amount of this item
                  plus any fees allowed by law.`}
                </td>
              </tr>
            </tbody>
          </table>
          <table cellPadding={5} cellSpacing={0} width="100%">
            <thead>
              <tr>
                <th
                  style={{
                    borderTop: border,
                    borderRight: border,
                  }}
                  align="left"
                >
                  Customer Signature:
                </th>
                <th
                  style={{
                    borderTop: border,
                    width: 110,
                  }}
                  align="left"
                >
                  Date:
                </th>
              </tr>
            </thead>
          </table>
        </div>
      )} */}
      </PrintPage>
    </>
  );
};
