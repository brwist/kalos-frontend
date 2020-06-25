import React, {FC, useEffect, useReducer} from 'react';
import { InvoiceClient, Invoice } from '@kalos-core/kalos-rpc/Invoice';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { PrintPage } from '../ComponentsLibrary/PrintPage';
import { PrintHeader } from '../ComponentsLibrary/PrintHeader';
import { ENDPOINT } from '../../constants';
import { PrintParagraph } from '../ComponentsLibrary/PrintParagraph';
import { PrintTable } from '../ComponentsLibrary/PrintTable';

const userClient = new UserClient(ENDPOINT);
const invoiceClient = new InvoiceClient(ENDPOINT);
const propertyClient = new PropertyClient(ENDPOINT);
const eventClient = new EventClient(ENDPOINT);

type Props = {
  invoiceId: number,
};

type State = {
  loading: boolean,
  invoice: Invoice.AsObject,
  customer: User.AsObject,
  property: Property.AsObject,
  event: Event.AsObject,
}

type Action =
  | { type: 'fetching' }
  | { type: 'fetched', data: State }
  | { type: 'errored', message: string };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'fetching': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'fetched': {
      return {
        ...state,
        loading: false,
        invoice: action.data.invoice,
        customer: action.data.customer,
        property: action.data.property,
        event: action.data.event,
      };
    }
    default:
      return state;
  }
};


const InvoiceViewer: FC<Props> = ({ invoiceId }: Props) => {
  const [{ loading, invoice, customer, property, event }, dispatch] = useReducer(reducer, {
    loading: true,
    invoice: new Invoice(),
    customer: new User(),
    property: new Property(),
    event: new Event(),
  });
  useEffect(() => {
    (async () => {
      dispatch({ type: 'fetching' });
      try {
        await userClient.GetToken('test', 'test');
        const invoiceReq = new Invoice();
        invoiceReq.setId(invoiceId);
        const invoiceResult = await invoiceClient.Get(invoiceReq);
        const propertyReq = new Property();
        propertyReq.setId(invoiceResult.propertyId);
        const propertyResult = await propertyClient.Get(propertyReq);
        const eventReq = new Event();
        eventReq.setId(invoiceResult.eventId);
        const eventResult = await eventClient.Get(eventReq);
        dispatch({
          type: 'fetched',
          data: {
            invoice: invoiceResult,
            property: propertyResult,
            event: eventResult,
            customer: eventResult.customer,
          },
        })
      } catch (e) {
        console.log(e);
        dispatch({ type: 'errored', message: e.message });
      }

    })();
  }, []);
  console.log(invoice, customer, property, event);
  if (loading) {
    return null;
  }
  const tableData = [];
  let totalAmount = 0;
  for (let i = 1; i <= 4; i++ ) {
    let serviceName = invoice[`servicesperformedrow${i}`];
    let serviceTotal = invoice[`totalamountrow${i}`];
    if (serviceName) {
      tableData.push([serviceName, serviceTotal]);
      totalAmount += Number(serviceTotal);
    }
  }
  tableData.push([
    'Discount',
    invoice.discount,
  ]);
  tableData.push([
    'Tax due',
    'TODO'
  ]);
  tableData.push([
    <>Payment by <strong>{invoice.logPaymentType}</strong> is <strong>{invoice.logPaymentStatus}</strong> for the total of</>,
    <strong key="total_amount">{totalAmount}</strong>
  ]);

  return (
    <PrintPage visible downloadPdfFilename="Invoice">
      <PrintHeader title="Print Header" />
      <PrintParagraph tag="h4">Site Address</PrintParagraph>
      <PrintParagraph>
        {property.firstname} {property.lastname}, {property.address}, {property.city}, {property.zip}, {property.phone}
      </PrintParagraph>
      <PrintParagraph tag="h4">Billing Address</PrintParagraph>
      <PrintParagraph>
        {customer.businessname}, {customer.address}, {customer.city}, {customer.zip}, {customer.phone}, {customer.email}
      </PrintParagraph>
      <PrintParagraph tag="h4">Invoice</PrintParagraph>
      <PrintParagraph>
        Date: {event.dateCreated}<br />
        Job #: {event.logJobNumber}
      </PrintParagraph>
      <PrintParagraph tag="h4">Services Rendered</PrintParagraph>
      <PrintParagraph>
        {invoice.notes}
      </PrintParagraph>
      <PrintTable
        columns={[
          { title: '', align: 'left' },
          { title: '', align: 'right' },
        ]}
        data={tableData}
      />
      <PrintParagraph>
        The undersigned has authority to order the above labor and materials on behalf of the above named purchaser. The labor and materials described above have been completely and
        satisfactorily performed and furnished. Kalos Services is not liable for any defects in labor or material unless the purchaser gives written notice of such defects within 30 days from
        the date of this contract. Payment in full is due upon receipt of this invoice and payable upon completion of work. The purchaser should be aware that under Florida law, Kalos
        Services has the right to file a mechanics lien if payment is not made per the terms of this document. Purchaser agrees to pay all costs of collection including a reasonable
        attorney's fee, in case this contract is not paid in full when due and the same is placed in the hands of an attorney for collection, foreclosure or repossession, whether suit be
        brought or not. All delinquent payments shall bear a service charge of 2% per month until paid. Selling price of all parts and equipment are on an exchange basis with the purchasers
        old parts and equipment. Warranty on all parts per manufacturers warranty policies 90 day labor guarantee: only on that portion previously serviced. If my payment is by check and
        my check is returned for any reason, I authorize the merchant to electronically debit my account for the amount of this item plus any fees allowed by law.
      </PrintParagraph>
    </PrintPage>
  );
};

export default InvoiceViewer;
