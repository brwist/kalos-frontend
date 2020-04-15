import React, { FC, useState, useCallback } from 'react';
import { EventType } from './ServiceCallDetails';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { Field } from '../../ComponentsLibrary/Field';
import { PAYMENT_TYPE_LIST } from '../../../constants';

type EventTypeExtended = EventType & {
  grandTotal: number;
};

interface Props {
  disabled: boolean;
  serviceItem: EventType;
}

export const Invoice: FC<Props> = ({ serviceItem }) => {
  const transformData = (data: EventType) => {
    const {
      totalamountrow1,
      totalamountrow2,
      totalamountrow3,
      totalamountrow4,
    } = data;
    const total1 = +totalamountrow1;
    const total2 = +totalamountrow2;
    const total3 = +totalamountrow3;
    const total4 = +totalamountrow4;
    const grandTotal = total1 + total2 + total3 + total4;
    return Object.assign({ ...data }, {
      totalamountrow1: total1.toString(),
      totalamountrow2: total2.toString(),
      totalamountrow3: total3.toString(),
      totalamountrow4: total4.toString(),
      grandTotal,
    } as EventTypeExtended);
  };
  const [data, setData] = useState<EventTypeExtended>(
    transformData(serviceItem),
  );
  const handleChange = useCallback(
    (data: EventTypeExtended) => setData(transformData(data)),
    [setData],
  );
  const SCHEMA: Schema<EventTypeExtended> = [
    [
      {
        label: 'Services Performed (1)',
        name: 'servicesperformedrow1',
      },
      {
        label: 'Total Amount (1)',
        name: 'totalamountrow1',
        type: 'number',
        startAdornment: '$',
      },
      {
        label: 'Services Performed (2)',
        name: 'servicesperformedrow2',
      },
      {
        label: 'Total Amount (2)',
        name: 'totalamountrow2',
        type: 'number',
        startAdornment: '$',
      },
    ],
    [
      {
        label: 'Services Performed (3)',
        name: 'servicesperformedrow3',
      },
      {
        label: 'Total Amount (3)',
        name: 'totalamountrow3',
        type: 'number',
        startAdornment: '$',
      },
      {
        label: 'Services Performed (4)',
        name: 'servicesperformedrow4',
      },
      {
        label: 'Total Amount (4)',
        name: 'totalamountrow4',
        type: 'number',
        startAdornment: '$',
      },
    ],
    [
      {
        label: 'Material Used',
        name: 'materialUsed',
        readOnly: true,
        multiline: true,
      },
      {
        label: 'Material Total',
        name: 'materialTotal',
        readOnly: true,
        type: 'number',
        startAdornment: '$',
      },
      {
        content: (
          <Field label="Payment" name="payment" value={0} startAdornment="$" />
        ), // FIXME
      },
      {
        label: 'Discount',
        name: 'discount',
        type: 'number',
        endAdornment: '%',
      },
    ],
    [
      {
        content: (
          <Field
            label="Grand Total"
            name="grandTotal"
            value={data.grandTotal}
            startAdornment="$"
          />
        ),
      },
      {
        content: (
          <Field
            label="Payments"
            name="payments"
            value={0}
            startAdornment="$"
          />
        ), // FIXME
      },
      {
        content: (
          <Field
            label="Remaining due"
            name="remainingDue"
            value={(1 - +data.discount / 100) * data.grandTotal} // FIXME
            startAdornment="$"
          />
        ),
      },
      {
        label: 'Billing Date',
        name: 'logBillingDate',
        type: 'date',
      },
    ],
    [
      {
        label: 'Payment Type',
        name: 'logPaymentType',
        options: PAYMENT_TYPE_LIST,
      },
      {
        label: 'PO',
        name: 'logPo',
      },
      {
        label: 'Use Property-level Billing?',
        name: 'propertyBilling',
        type: 'checkbox',
      },
      {
        label: 'Invoice Notes',
        name: 'notes',
        multiline: true,
      },
    ],
  ];
  return <PlainForm schema={SCHEMA} data={data} onChange={handleChange} />;
};
