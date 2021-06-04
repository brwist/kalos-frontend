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
import { formatDateTimeDay } from '../../../../helpers';
import { ENDPOINT } from '../../../../constants';

const sic = new ServiceItemClient(ENDPOINT);
const { COMPLETED, INCOMPLETE } = SERVICE_STATUSES;

type EventTypeExtended = EventType & {
  grandTotal: number;
};

interface Props {
  disabled: boolean;
  serviceItem: EventType;
  servicesRendered: ServicesRenderedType[];
  onInitSchema: (fields: string[]) => void;
  onChange: (serviceItem: EventType) => void;
}

export const Invoice: FC<Props> = ({
  serviceItem,
  servicesRendered,
  onInitSchema,
  onChange,
}) => {
  /*
    useEffect(() => {
      (async () => {
        const req = new ServiceItem();
        req.setId(serviceItem.id);
        console.log(req);
        const entry = await sic.Get(req);
        console.log('fetched: ', entry)
      })();
    }, []);
  */

  const [initSchemaCalled, setInitSchemaCalled] = useState<boolean>(false);

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

  const [formKey, setFormKey] = useState<number>(0);
  const data = transformData(serviceItem);

  const handleChange = useCallback(
    (data: EventTypeExtended) => onChange(transformData(data)),
    [onChange],
  );

  const handleCopyFromServicesRendered = useCallback(() => {
    const servicesRenderedNotes: string = servicesRendered
      .filter(({ status }) => [COMPLETED, INCOMPLETE].includes(status))
      .map(({ datetime, name, serviceRendered }) =>
        [formatDateTimeDay(datetime), name, '-', serviceRendered].join(' '),
      )
      .join('\n');
    onChange({ ...data, notes: servicesRenderedNotes });
    setFormKey(formKey + 1);
  }, [onChange, data, setFormKey, formKey, servicesRendered]);

  const SCHEMA: Schema<EventTypeExtended> = useMemo(
    () => [
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
            <Field
              label="Payment"
              name="payment"
              value={0}
              startAdornment="$"
            />
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
    [data.discount, data.grandTotal, handleCopyFromServicesRendered],
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
