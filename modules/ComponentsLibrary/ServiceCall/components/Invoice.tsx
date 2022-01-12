import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import {
  ServiceItem,
  ServiceItemClient,
} from '@kalos-core/kalos-rpc/ServiceItem';
import {
  InvoiceClient,
  Invoice as InvoiceType,
} from '@kalos-core/kalos-rpc/Invoice';
import { EventType, ServicesRenderedType } from '../';
import { PlainForm, Schema } from '../../PlainForm';
import { Field } from '../../Field';
import { PAYMENT_TYPE_LIST, SERVICE_STATUSES } from '../../../../constants';
import { formatDateTimeDay, makeSafeFormObject } from '../../../../helpers';
import { ENDPOINT } from '../../../../constants';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { SQSEmailAndDocument } from '@kalos-core/kalos-rpc/compiled-protos/email_pb';
import { Payment, PaymentClient } from '@kalos-core/kalos-rpc/Payment';

const sic = new ServiceItemClient(ENDPOINT);

const { COMPLETED, INCOMPLETE } = SERVICE_STATUSES;

interface Props {
  disabled: boolean;
  serviceItem: Event;
  servicesRendered: ServicesRendered[];
  paidServices: Payment[];
  onInitSchema: (fields: string[]) => void;
  onChange: (serviceItem: Event) => void;
}

export const Invoice: FC<Props> = ({
  serviceItem,
  servicesRendered,
  paidServices,
  onInitSchema,
  onChange,
}) => {
  const [initSchemaCalled, setInitSchemaCalled] = useState<boolean>(false);

  const transformData = useCallback((data: Event) => {
    const totalamountrow1 = data.getTotalamountrow1();
    const totalamountrow2 = data.getTotalamountrow2();
    const totalamountrow3 = data.getTotalamountrow3();
    const totalamountrow4 = data.getTotalamountrow4();

    const total1 = +totalamountrow1;
    const total2 = +totalamountrow2;
    const total3 = +totalamountrow3;
    const total4 = +totalamountrow4;
    data.setTotalamountrow1(total1.toString());
    data.setTotalamountrow2(total2.toString());
    data.setTotalamountrow3(total3.toString());
    data.setTotalamountrow4(total4.toString());
    return data;
  }, []);
  const [formKey, setFormKey] = useState<number>(0);
  const [emailData, setEmailData] = useState<SQSEmailAndDocument>(
    new SQSEmailAndDocument(),
  );
  /*
- [ ] standard invoice header (copy paste whatever)
    - [ ] Property Address, Billing Address, JobNumber and Billing Date
        - [ ] Services Rendered from each Row and Cost
        - [ ] Materials breakdown and Cost
        - [ ] Service items
        - [ ] Discount amount
        - [ ] Tax Due
        - [ ] Grand Total
    - [ ] Selected Property Service Items
        - [ ] Readings
        - [ ] Materials
*/
  const data = transformData(serviceItem);

  const handleChange = useCallback(
    (data: Event) =>
      onChange(transformData(makeSafeFormObject(data, new Event()))),
    [onChange, transformData],
  );
  const totalPaid = paidServices.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.getAmountCollected(),
    0,
  );
  const handleCopyFromServicesRendered = useCallback(() => {
    const servicesRenderedNotes: string = servicesRendered
      .filter(status => [COMPLETED, INCOMPLETE].includes(status.getStatus()))
      .map(service =>
        [
          formatDateTimeDay(service.getDatetime()),
          service.getName(),
          '-',
          service.getServiceRendered(),
        ].join(' '),
      )
      .join('\n');
    data.setNotes(servicesRenderedNotes);
    onChange(data);
    setFormKey(formKey + 1);
  }, [onChange, data, setFormKey, formKey, servicesRendered]);
  const totalRemianing =
    (1 - +data.getDiscount() / 100) *
      (parseInt(data.getTotalamountrow1()) +
        parseInt(data.getTotalamountrow2()) +
        parseInt(data.getTotalamountrow3()) +
        parseInt(data.getTotalamountrow4())) -
    totalPaid;
  const SCHEMA: Schema<Event> = useMemo(
    () => [
      [
        {
          label: 'Services Performed (1)',
          name: 'getServicesperformedrow1',
        },
        {
          label: 'Total Amount (1)',
          name: 'getTotalamountrow1',
          type: 'number',
          startAdornment: '$',
        },
        {
          label: 'Services Performed (2)',
          name: 'getServicesperformedrow2',
        },
        {
          label: 'Total Amount (2)',
          name: 'getTotalamountrow2',
          type: 'number',
          startAdornment: '$',
        },
      ],
      [
        {
          label: 'Services Performed (3)',
          name: 'getServicesperformedrow3',
        },
        {
          label: 'Total Amount (3)',
          name: 'getTotalamountrow3',
          type: 'number',
          startAdornment: '$',
        },
        {
          label: 'Services Performed (4)',
          name: 'getServicesperformedrow4',
        },
        {
          label: 'Total Amount (4)',
          name: 'getTotalamountrow4',
          type: 'number',
          startAdornment: '$',
        },
      ],
      [
        {
          label: 'Material Used',
          name: 'getMaterialUsed',
          readOnly: true,
          multiline: true,
        },
        {
          label: 'Material Total',
          name: 'getMaterialTotal',
          readOnly: true,
          type: 'number',
          startAdornment: '$',
        },
        {
          content: (
            <Field
              label="Payment"
              name="getPayment"
              value={0}
              startAdornment="$"
            />
          ), // FIXME
        },
        {
          label: 'Discount',
          name: 'getDiscount',
          type: 'number',
          endAdornment: '%',
        },
      ],
      [
        {
          content: (
            <Field
              label="Grand Total"
              type="number"
              name="getTotalAmountTotal"
              startAdornment="$"
              disabled={true}
              value={
                parseInt(data.getTotalamountrow1()) +
                parseInt(data.getTotalamountrow2()) +
                parseInt(data.getTotalamountrow3()) +
                parseInt(data.getTotalamountrow4())
              }
            />
          ),
        },

        {
          content: (
            <Field
              label="Payments"
              name="getPayments"
              value={totalPaid}
              startAdornment="$"
            />
          ), // FIXME
        },
        {
          content: (
            <Field
              label="Remaining due"
              name="getRemainingDue"
              value={totalRemianing}
              startAdornment="$"
            />
          ),
        },
        {
          label: 'Billing Date',
          name: 'getLogBillingDate',
          type: 'date',
        },
      ],
      [
        {
          label: 'Payment Type',
          name: 'getLogPaymentType',
          options: PAYMENT_TYPE_LIST,
        },
        {
          label: 'PO',
          name: 'getLogPo',
        },
        {
          label: 'Use Property-level Billing?',
          name: 'getPropertyBilling',
          type: 'checkbox',
        },
        {
          label: 'Invoice Notes',
          name: 'getNotes',
          multiline: true,
          actions: [
            {
              label: 'Copy from Services Rendered',
              variant: 'text',
              onClick: handleCopyFromServicesRendered,
            },
          ],
          actionsInLabel: true,
        },
      ],
    ],
    [data, totalPaid, totalRemianing, handleCopyFromServicesRendered],
  );

  useEffect(() => {
    if (!initSchemaCalled) {
      setInitSchemaCalled(true);
      const fields = SCHEMA.map(item =>
        item.map(({ name }) => name).filter(name => name),
      ).reduce((aggr, item) => [...aggr, ...item], []);
      onInitSchema(fields as string[]);
    }
  }, [initSchemaCalled, setInitSchemaCalled, onInitSchema, SCHEMA]);

  return (
    <PlainForm
      key={formKey}
      schema={SCHEMA}
      data={data}
      onChange={handleChange}
    />
  );
};
