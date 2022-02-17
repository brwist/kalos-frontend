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
import {
  PAYMENT_STATUS_LIST,
  PAYMENT_TYPE_LIST,
  SERVICE_STATUSES,
} from '../../../../constants';
import { formatDateTimeDay, makeSafeFormObject } from '../../../../helpers';
import { ENDPOINT } from '../../../../constants';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { SQSEmailAndDocument } from '@kalos-core/kalos-rpc/compiled-protos/email_pb';
import { Payment, PaymentClient } from '@kalos-core/kalos-rpc/Payment';
import { type } from 'os';
import { disconnect } from 'process';

const sic = new ServiceItemClient(ENDPOINT);

const { COMPLETED, INCOMPLETE } = SERVICE_STATUSES;

interface Props {
  disabled: boolean;
  event: Event;
  servicesRendered: ServicesRendered[];
  paidServices: Payment[];

  onInitSchema: (fields: string[]) => void;
  onChangeServices: (serviceItem: Event) => void;
  onChangePayment: (serviceItem: Event) => void;
}

export const Invoice: FC<Props> = ({
  event,
  servicesRendered,
  paidServices,
  onInitSchema,
  onChangeServices,
  onChangePayment,
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

  const data = transformData(event);
  const handleChangeServices = useCallback(
    (data: Event) =>
      onChangeServices(transformData(makeSafeFormObject(data, new Event()))),
    [onChangeServices, transformData],
  );
  const handleChangePayment = useCallback(
    (data: Event) => onChangePayment(makeSafeFormObject(data, new Event())),
    [onChangePayment],
  );
  const totalPaid = paidServices.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.getAmountCollected(),
    0,
  );
  const discountAmount =
    (parseInt(data.getTotalamountrow1()) +
      parseInt(data.getTotalamountrow2()) +
      parseInt(data.getTotalamountrow3()) +
      parseInt(data.getTotalamountrow4()) +
      data.getMaterialTotal()) *
    (parseInt(data.getDiscount()) / 100);
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
    onChangeServices(data);
    setFormKey(formKey + 1);
  }, [onChangeServices, data, setFormKey, formKey, servicesRendered]);
  const totalRemaining =
    parseInt(data.getTotalamountrow1()) +
    parseInt(data.getTotalamountrow2()) +
    parseInt(data.getTotalamountrow3()) +
    +data.getMaterialTotal() +
    parseInt(data.getTotalamountrow4()) -
    (totalPaid + discountAmount);
  const SCHEMA: Schema<Event> = useMemo(
    () => [
      [
        {
          label: 'Services Performed (1)',
          name: 'getServicesperformedrow1',
        },
      ],
      [
        {
          label: 'Total Amount (1)',
          name: 'getTotalamountrow1',
          type: 'number',
          startAdornment: '$',
        },
      ],
      [
        {
          label: 'Services Performed (2)',
          name: 'getServicesperformedrow2',
        },
      ],
      [
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
      ],
      [
        {
          label: 'Total Amount (3)',
          name: 'getTotalamountrow3',
          type: 'number',
          startAdornment: '$',
        },
      ],
      [
        {
          label: 'Services Performed (4)',
          name: 'getServicesperformedrow4',
        },
      ],
      [
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
      ],
      [
        {
          label: 'Material Total',
          name: 'getMaterialTotal',
          readOnly: true,
          type: 'number',
          startAdornment: '$',
        },
      ],
      [
        {
          content: (
            <Field label="Payment" name="getPayment" startAdornment="$" />
          ),
        },
        {},
      ],
      [
        {
          label: 'Discount',
          name: 'getDiscount',
          type: 'number',
          endAdornment: '%',
        },
        {
          content: (
            <Field
              label="Discount Amount"
              type="number"
              name="getDiscountCost"
              startAdornment="$"
              disabled={true}
              value={discountAmount}
            />
          ),
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
                parseInt(data.getTotalamountrow4()) +
                data.getMaterialTotal() -
                discountAmount
              }
            />
          ),
        },
      ],
      [
        {
          content: (
            <Field
              label="Payments"
              name="getPayments"
              value={totalPaid}
              startAdornment="$"
            />
          ),
        },
      ],
      [
        {
          content: (
            <Field
              label="Remaining due"
              name="getRemainingDue"
              value={totalRemaining}
              startAdornment="$"
            />
          ),
        },
        {},
      ],
    ],
    [data, totalPaid, discountAmount, totalRemaining],
  );
  const SCHEMA_PART_2: Schema<Event> = useMemo(
    () => [
      [{}],
      [
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
      ],
      [
        {
          label: 'Payment Status',
          name: 'getLogPaymentStatus',
          options: PAYMENT_STATUS_LIST,
        },
      ],
      [
        {
          label: 'PO',
          name: 'getLogPo',
        },
      ],

      [
        {
          label: 'Use Property-level Billing?',
          name: 'getPropertyBilling',
          type: 'checkbox',
        },
      ],
      [
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
    [handleCopyFromServicesRendered],
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
    <div>
      <div
        style={{
          display: 'inline-block',
          width: '49%',
          verticalAlign: 'top',
        }}
      >
        <PlainForm
          key={formKey}
          schema={SCHEMA}
          data={data}
          onChange={handleChangeServices}
        />
      </div>
      <div
        style={{
          display: 'inline-block',
          width: '50%',
          verticalAlign: 'top',
        }}
      >
        <PlainForm
          compact={true}
          key={formKey}
          schema={SCHEMA_PART_2}
          data={data}
          onChange={handleChangePayment}
        />
      </div>
    </div>
  );
};
