import React, { FC, useEffect, useState, useCallback } from 'react';
import { PrintPage } from '../PrintPage';
import { loadEventById } from '../../../helpers';
import { PrefabKalosInfo } from './PrefabKalosInfo';
import { PrefabPropertyInfo } from './PrefabPropertyInfo';
import { PrefabPayables } from './PrefabPayables';
import './styles.scss';
import { Event } from '@kalos-core/kalos-rpc/Event';

interface Props {
  serviceCallId: number;
}

const border = '1px solid #000';

export const PDFInvoice: FC<Props> = ({ serviceCallId }) => {
  const [event, setEvent] = useState<Event>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const load = useCallback(async () => {
    const event = await loadEventById(serviceCallId);
    setEvent(event);
  }, [serviceCallId]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [load, loaded]);
  console.log({ event });
  return (
    <PrintPage downloadPdfFilename="lorem_ipsum_1">
      {event && (
        <div className="wrapper" style={{ height: 1100 }}>
          <PrefabKalosInfo />
          <PrefabPropertyInfo event={event} />
          <PrefabPayables event={event} />
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
                  {event.notes}
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
                  {event.servicesperformedrow1}
                </td>
                <td
                  style={{
                    borderTop: border,
                  }}
                >
                  {event.totalamountrow1}&nbsp;
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: border,
                    borderRight: border,
                  }}
                >
                  {event.servicesperformedrow2}
                </td>
                <td
                  style={{
                    borderTop: border,
                  }}
                >
                  {event.totalamountrow2}&nbsp;
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: border,
                    borderRight: border,
                  }}
                >
                  {event.servicesperformedrow3}
                </td>
                <td
                  style={{
                    borderTop: border,
                  }}
                >
                  {event.totalamountrow3}&nbsp;
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    borderTop: border,
                    borderRight: border,
                  }}
                >
                  {event.servicesperformedrow4}
                </td>
                <td
                  style={{
                    borderTop: border,
                  }}
                >
                  {event.totalamountrow4}&nbsp;
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
                          {event.logPaymentType}&nbsp;
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Payment Status:</strong>
                        </td>
                        <td style={{ borderBottom: border }}>
                          {event.logPaymentStatus}&nbsp;
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
                          {event.materialTotal}&nbsp;
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
                          {event.compressorAmps}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Condensing Fan Amps:</strong>{' '}
                          {event.condensingFanAmps}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Suction Pressure:</strong>{' '}
                          {event.suctionPressure}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Head Pressure:</strong> {event.headPressure}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Return Temperature:</strong>{' '}
                          {event.returnTemperature}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Supply Temperature:</strong>{' '}
                          {event.supplyTemperature}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderBottom: border }}>
                          <strong>Subcool:</strong> {event.subcool}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Superheat:</strong> {event.superheat}
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
                  The undersigned has authority to order the above labor and
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
                  plus any fees allowed by law.
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
  );
};
