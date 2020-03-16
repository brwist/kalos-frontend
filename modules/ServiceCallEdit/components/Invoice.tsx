import React, { FC } from 'react';
import { EventType } from './ServiceCallDetails';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { makeFakeRows } from '../../../helpers';
import { PAYMENT_TYPE_LIST } from '../../../constants';

interface Props {
  loading: boolean;
  disabled: boolean;
  serviceItem: EventType;
}

export const Invoice: FC<Props> = ({ serviceItem, loading }) => {
  console.log({ serviceItem });
  const SCHEMA: Schema<EventType> = [
    [
      { label: 'Services Performed (1)', name: 'servicesperformedrow1' },
      {
        label: 'Total Amount (1)',
        name: 'totalamountrow1',
        type: 'number',
        endAdornment: '$',
      },
      { label: 'Services Performed (2)', name: 'servicesperformedrow2' },
      {
        label: 'Total Amount (2)',
        name: 'totalamountrow2',
        type: 'number',
        endAdornment: '$',
      },
    ],
    [
      { label: 'Services Performed (3)', name: 'servicesperformedrow3' },
      {
        label: 'Total Amount (3)',
        name: 'totalamountrow3',
        type: 'number',
        endAdornment: '$',
      },
      { label: 'Services Performed (4)', name: 'servicesperformedrow4' },
      {
        label: 'Total Amount (4)',
        name: 'totalamountrow4',
        type: 'number',
        endAdornment: '$',
      },
    ],
    [
      { label: 'Material Used', name: 'materialUsed', readOnly: true },
      {
        label: 'Material Total',
        name: 'materialTotal',
        readOnly: true,
        type: 'number',
        endAdornment: '$',
      },
      //   { label: 'Payment', name: 'color', readOnly: true }, // FIXME
      {
        label: 'Discount',
        name: 'discount',
        type: 'number',
        endAdornment: '%',
      },
    ],
    [
      //   { label: 'Grand Total', name: 'id' }, // FIXME
      //   { label: 'Payments', name: 'id', readOnly: true }, // FIXME
      //   { label: 'Remaining due', name: 'id', readOnly: true }, // FIXME
      { label: 'Billing Date', name: 'logBillingDate', type: 'date' },
    ],
    [
      {
        label: 'Payment Type',
        name: 'logPaymentType',
        options: PAYMENT_TYPE_LIST,
      },
      { label: 'PO', name: 'logPo' },
      {
        label: 'Use Property-level Billing?',
        name: 'propertyBilling',
        type: 'checkbox',
      },
      { label: 'Invoice Notes', name: 'notes' },
    ],
  ];
  if (loading) return <InfoTable data={makeFakeRows(4, 5)} loading />;
  return (
    <PlainForm
      schema={SCHEMA}
      data={serviceItem}
      onChange={a => console.log(a)}
    />
  );
};
