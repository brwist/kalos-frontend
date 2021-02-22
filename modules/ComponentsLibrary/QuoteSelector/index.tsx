import React, { FC, useState, useCallback, useEffect } from 'react';
import { Quotable } from '@kalos-core/kalos-rpc/Event';
import { SectionBar } from '../SectionBar';
import { Modal } from '../Modal';
import { InfoTable, Data, Columns } from '../InfoTable';
import { Field, Value } from '../Field';
import { Form, Schema } from '../Form';
import { Filter } from './filter';
import {
  loadQuoteParts,
  makeFakeRows,
  QuotableType,
  usd,
  EventClientService,
} from '../../../helpers';

type SelectedQuote = {
  quotePart: QuotableType;
  billable: boolean;
  quantity: number;
};
interface Props {
  serviceCallId: number;
  onAdd?: () => void;
  onAddQuotes?: (quotes: SelectedQuote[]) => void;
}

const COLUMNS: Columns = [
  { name: 'Selected' },
  { name: 'Billable' },
  { name: 'Part/Labor' },
  { name: 'Quantity' },
  { name: 'Price' },
];

const COLUMNS_QUOTABLE: Columns = [
  { name: 'Description' },
  { name: 'Quantity' },
  { name: 'Price' },
  { name: 'Amount' },
];

const SCHEMA_NEW_QUOTABLE: Schema<QuotableType> = [
  [
    {
      name: 'description',
      label: 'Item/Labor Name',
    },
    {
      name: 'isLmpc',
      type: 'checkbox',
      label: 'LMPC',
    },
  ],
  [
    {
      name: 'quotedPrice',
      type: 'number',
      label: 'Price',
      startAdornment: '$',
    },
    {
      name: 'quantity',
      type: 'number',
      label: 'QTY',
    },
  ],
];

export const QuoteSelector: FC<Props> = ({
  serviceCallId,
  onAdd,
  onAddQuotes,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [newQuotable, setNewQuotable] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [quotable, setQuotable] = useState<QuotableType[]>([]);
  const [quoteParts, setQuoteParts] = useState<QuotableType[]>([]);
  const [selectedQuoteLineIds, setSelectedQuoteLineIds] = useState<number[]>(
    [],
  );
  const [billable, setBillable] = useState<{
    [key: number]: {
      billable: boolean;
      quantity: number;
    };
  }>({});
  const load = useCallback(async () => {
    setLoading(true);
    const [quoteParts, quotable] = await Promise.all([
      loadQuoteParts(
        {
          pageNumber: 0,
          isFlatrate: true,
        },
        ['QuoteUsedId'],
      ),
      EventClientService.loadQuotable(serviceCallId),
    ]);
    setQuoteParts(quoteParts);
    setQuotable(quotable);
    setLoaded(true);
    setLoading(false);
  }, [setLoaded, setLoading, serviceCallId, setQuoteParts, setQuotable]);
  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);
  const handleToggleOpen = useCallback(() => setOpen(!open), [open, setOpen]);
  const handleToggleQuoteLineSelect = useCallback(
    (id: number) => (value: Value) => {
      setSelectedQuoteLineIds(
        value
          ? [...selectedQuoteLineIds, id]
          : selectedQuoteLineIds.filter(_id => _id !== id),
      );
      if (value) {
        setBillable({
          ...billable,
          [id]: {
            billable: true,
            quantity: 1,
          },
        });
      }
    },
    [selectedQuoteLineIds, billable],
  );
  const handleToggleBillable = useCallback(
    (id: number) => (value: Value) => {
      setBillable({
        ...billable,
        [id]: {
          billable: !!value,
          quantity: billable[id].quantity || 1,
        },
      });
    },
    [billable],
  );
  const handleToggleBillableQuantity = useCallback(
    (id: number) => (value: Value) => {
      setBillable({
        ...billable,
        [id]: {
          billable: billable[id].billable,
          quantity: +value,
        },
      });
    },
    [billable],
  );
  const handleAddQuotes = useCallback(() => {
    if (onAddQuotes) {
      onAddQuotes(
        Object.keys(billable).map(id => ({
          quotePart: quoteParts.find(q => q.quoteLineId === +id)!,
          billable: billable[+id].billable,
          quantity: billable[+id].quantity,
        })),
      );
      setOpen(false);
    }
  }, [billable, quoteParts, onAddQuotes]);
  const handleToggleNewQuotable = useCallback(
    () => setNewQuotable(!newQuotable),
    [newQuotable],
  );
  const handleSaveNewQuotable = useCallback(
    ({ quantity, ...data }: QuotableType) => {
      const quotePart = new Quotable().toObject();
      Object.assign(quotePart, {
        ...data,
        isActive: true, // TODO rest default props?
      });
      if (onAddQuotes) {
        onAddQuotes([{ billable: true, quantity, quotePart }]);
      }
      setNewQuotable(false);
      setOpen(false);
    },
    [onAddQuotes],
  );
  // console.log({ quotable, quoteParts });
  const data: Data = loading
    ? makeFakeRows(6, 20)
    : quoteParts
        .filter(({ description }) =>
          !!filter
            ? description
                .toLocaleLowerCase()
                .includes(filter.toLocaleLowerCase())
            : true,
        )
        .map(({ quoteLineId, description, quotedPrice }) => [
          {
            value: (
              <Field
                name="selected"
                type="checkbox"
                style={{ marginBottom: 0 }}
                value={selectedQuoteLineIds.includes(quoteLineId)}
                onChange={handleToggleQuoteLineSelect(quoteLineId)}
              />
            ),
          },
          {
            value: selectedQuoteLineIds.includes(quoteLineId) ? (
              <Field
                name="selectedBillable"
                type="checkbox"
                style={{ marginBottom: 0 }}
                value={billable[quoteLineId].billable}
                onChange={handleToggleBillable(quoteLineId)}
              />
            ) : (
              ''
            ),
          },
          { value: description },
          {
            value: selectedQuoteLineIds.includes(quoteLineId) ? (
              <Field
                name="selected"
                type="number"
                style={{ marginBottom: 0 }}
                value={billable[quoteLineId].quantity}
                onChange={handleToggleBillableQuantity(quoteLineId)}
              />
            ) : (
              ''
            ),
          },
          {
            value: usd(
              selectedQuoteLineIds.includes(quoteLineId)
                ? billable[quoteLineId].quantity * quotedPrice
                : quotedPrice,
            ),
          },
        ]);
  const dataQuotable: Data = loading
    ? makeFakeRows(4, 5)
    : quotable.map(({ description, quantity, quotedPrice, isBillable }) => [
        { value: description },
        { value: quantity },
        { value: usd(quotedPrice) },
        { value: usd(isBillable ? quantity * quotedPrice : 0) },
      ]);
  return (
    <div>
      <SectionBar
        title="Supplies / Services"
        actions={
          onAdd
            ? [
                {
                  label: 'Add',
                  onClick: handleToggleOpen,
                  disabled: loading,
                },
              ]
            : undefined
        }
        fixedActions
      />
      <InfoTable
        columns={COLUMNS_QUOTABLE}
        data={dataQuotable}
        loading={loading}
      />
      {open && (
        <Modal open onClose={handleToggleOpen} fullScreen>
          <SectionBar
            title="Select Item(s)"
            actions={[
              {
                label: 'New Part/Labor',
                variant: 'outlined',
                onClick: handleToggleNewQuotable,
              },
              ...(onAddQuotes
                ? [{ label: 'Add Selected', onClick: handleAddQuotes }]
                : []),
              { label: 'Close', onClick: handleToggleOpen },
            ]}
            fixedActions
          />
          <Filter onSearch={setFilter} />
          <InfoTable
            columns={COLUMNS}
            data={data}
            hoverable
            loading={loading}
          />
        </Modal>
      )}
      {newQuotable && (
        <Modal open onClose={handleToggleNewQuotable}>
          <Form<QuotableType>
            title="Adding the following Part of Labor to Current Job Invoice"
            schema={SCHEMA_NEW_QUOTABLE}
            onClose={handleToggleNewQuotable}
            onSave={handleSaveNewQuotable}
            data={new Quotable().toObject()}
          />
        </Modal>
      )}
    </div>
  );
};
