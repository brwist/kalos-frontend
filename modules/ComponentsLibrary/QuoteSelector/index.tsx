import React, { FC, useState, useCallback, useEffect } from 'react';
import { EventClient, Quotable } from '../../../@kalos-core/kalos-rpc/Event';
import { SectionBar } from '../SectionBar';
import { Modal } from '../Modal';
import { InfoTable, Data, Columns } from '../InfoTable';
import { Field, Value } from '../Field';
import { Form, Schema } from '../Form';
import { Filter } from './filter';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';

import {
  makeFakeRows,
  usd,
  EventClientService,
  makeSafeFormObject,
  QuoteLineClientService,
} from '../../../helpers';
import { QuotableRead } from '../../../@kalos-core/kalos-rpc/compiled-protos/event_pb';
import {
  QuoteUsed,
  QuoteUsedClient,
} from '../../../@kalos-core/kalos-rpc/QuoteUsed';
import { ENDPOINT } from '../../../@kalos-core/kalos-rpc/constants';
import { QuoteLine } from '../../../@kalos-core/kalos-rpc/QuoteLine';
import { ActionsProps } from '../Actions';
export type SelectedQuote = {
  quotePart: Quotable;
  billable: boolean;
  quantity: number;
};
interface Props {
  servicesRenderedId?: number;
  onUpdate?: () => void;
  onAddQuotes?: (quotes: SelectedQuote[]) => void;
  savePendingQuotes?: (
    servicesRenderedId: number,
    selectedQuotes: Quotable[],
  ) => void;
  pendingQuotableProp?: Quotable[];
  pendingNewQuotableProp?: Quotable[];
  setPendingQuotableProp?: (quotes: Quotable[]) => void;
  setPendingNewQuotableProp?: (quotes: Quotable[]) => void;
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
  { name: 'Actions' },
];

const SCHEMA_NEW_QUOTABLE: Schema<Quotable> = [
  [
    {
      name: 'getDescription',
      label: 'Item/Labor Name',
    },
    {
      name: 'getIsLmpc',
      type: 'checkbox',
      label: 'LMPC',
    },
  ],
  [
    {
      name: 'getQuotedPrice',
      type: 'number',
      label: 'Price',
      startAdornment: '$',
    },
    {
      name: 'getQuantity',
      type: 'number',
      label: 'QTY',
    },
  ],
];

export const QuoteSelector: FC<Props> = ({
  servicesRenderedId,
  onUpdate,
  onAddQuotes,
  pendingNewQuotableProp,
  pendingQuotableProp,
  setPendingNewQuotableProp,
  setPendingQuotableProp,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [newQuotable, setNewQuotable] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [quotable, setQuotable] = useState<Quotable[]>([]);
  const [originalQuotable, setOriginalQuotable] = useState<Quotable[]>([]);
  const [quoteParts, setQuoteParts] = useState<Quotable[]>([]);
  const [pendingQuotable, setPendingQuotable] = useState<Quotable[]>(
    pendingQuotableProp ? pendingQuotableProp : [],
  );
  const [pendingNewQuotable, setPendingNewQuotable] = useState<Quotable[]>(
    pendingNewQuotableProp ? pendingNewQuotableProp : [],
  );
  const [pendingDeleteQuotable, setPendingDeleteQuotable] = useState<
    Quotable[]
  >([]);

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
    if (pendingNewQuotable)
      if (servicesRenderedId) {
        const flatRateReq = new QuoteLine();
        flatRateReq.setIsFlatrate('1');
        flatRateReq.setIsActive(1);
        flatRateReq.setWithoutLimit(true);
        const req = new QuotableRead();

        req.setServicesRenderedId(servicesRenderedId);
        req.setIsActive(true);
        req.setFieldMaskList(['IsActive']);

        const [flatRate, quotable] = await Promise.all([
          QuoteLineClientService.BatchGet(flatRateReq), //this should be the flat rate items
          EventClientService.ReadQuotes(req), //this should be the all materials/services associated with the service call
        ]);
        const flatRateQuotable = flatRate.getResultsList().map(item => {
          let quote = new Quotable();
          quote.setIsActive(true);
          quote.setIsBillable(true);
          quote.setIsFlatrate(true);
          quote.setQuantity(1);
          quote.setQuotedPrice(parseInt(item.getAdjustment()));
          quote.setId(item.getId());
          quote.setQuoteLineId(item.getId());
          quote.setDescription(item.getDescription());

          return quote;
        });
        let tempFlatRate = flatRateQuotable;
        let tempQuotable = quotable.getDataList();
        for (let i = 0; i < tempQuotable.length; i++) {
          tempFlatRate = tempFlatRate.filter(
            flatRate =>
              flatRate.getQuoteLineId() != tempQuotable[i].getQuoteLineId(),
          );
        }
        setQuoteParts(tempFlatRate);
        setQuotable(quotable.getDataList());
        setOriginalQuotable(quotable.getDataList());
      } else {
        const flatRateReq = new QuoteLine();
        flatRateReq.setIsFlatrate('1');
        flatRateReq.setIsActive(1);
        flatRateReq.setWithoutLimit(true);

        const [flatRate] = await Promise.all([
          QuoteLineClientService.BatchGet(flatRateReq), //this should be the flat rate items
        ]);
        const flatRateQuotable = flatRate.getResultsList().map(item => {
          let quote = new Quotable();
          quote.setIsActive(true);
          quote.setIsBillable(true);
          quote.setIsFlatrate(true);
          quote.setQuantity(1);
          quote.setQuotedPrice(parseInt(item.getAdjustment()));
          quote.setId(item.getId());
          quote.setQuoteLineId(item.getId());
          quote.setDescription(item.getDescription());

          return quote;
        });

        setQuoteParts(flatRateQuotable);
      }
    setLoaded(true);
    setLoading(false);
  }, [
    setLoaded,
    setLoading,
    pendingNewQuotable,
    servicesRenderedId,
    setQuoteParts,
    setQuotable,
  ]);
  useEffect(() => {
    if (!loaded) {
      console.log('we are loadin');
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
  const handleDeleteQuoteLine = useCallback(async () => {
    const quoteUsedClientService = new QuoteUsedClient(ENDPOINT);
    for (let i = 0; i < pendingDeleteQuotable.length; i++) {
      let temp = pendingDeleteQuotable[i];
      let quoteUsed = new QuoteUsed();
      quoteUsed.setId(temp.getQuoteUsedId());
      await quoteUsedClientService.Delete(quoteUsed);
      if (onUpdate) {
        await onUpdate();
      }
    }
    setPendingDeleteQuotable([]);
  }, [pendingDeleteQuotable, onUpdate]);
  const handleAddToPendingDelete = useCallback(
    async (pendingRemoveQuotable: Quotable) => {
      let tempQuotable = quotable.filter(
        quote =>
          quote.getQuoteUsedId() != pendingRemoveQuotable.getQuoteUsedId(),
      );
      setQuotable(tempQuotable);
      let tempPendingDelete = pendingDeleteQuotable;
      tempPendingDelete.push(pendingRemoveQuotable);
      setPendingDeleteQuotable(tempPendingDelete);
    },

    [pendingDeleteQuotable, quotable],
  );
  const handleRemovePending = useCallback(
    async (pendingRemoveQuotable: Quotable) => {
      const tempSelected = selectedQuoteLineIds.filter(
        quote => quote != pendingRemoveQuotable.getQuoteLineId(),
      );
      setSelectedQuoteLineIds(tempSelected);
      const newPendingList = pendingQuotable.filter(
        quote =>
          quote.getQuoteLineId() != pendingRemoveQuotable.getQuoteLineId(),
      );
      setPendingQuotable(newPendingList);
      if (setPendingQuotableProp) {
        setPendingQuotableProp(newPendingList);
      }
    },
    [pendingQuotable, setPendingQuotableProp, selectedQuoteLineIds],
  );
  const handleRemoveNewPending = useCallback(
    async (pendingRemoveQuotable: Quotable) => {
      const tempSelected = selectedQuoteLineIds.filter(
        quote => quote != pendingRemoveQuotable.getQuoteLineId(),
      );
      setSelectedQuoteLineIds(tempSelected);
      const newPendingList = pendingNewQuotable.filter(
        quote =>
          quote.getQuoteLineId() != pendingRemoveQuotable.getQuoteLineId(),
      );
      setPendingNewQuotable(newPendingList);
      if (setPendingNewQuotableProp) {
        setPendingNewQuotableProp(newPendingList);
      }
    },
    [pendingNewQuotable, setPendingNewQuotableProp, selectedQuoteLineIds],
  );
  const handleAddQuotes = useCallback(async () => {
    const temp: Quotable[] = [];
    Object.keys(billable).map(id => {
      let quote = quoteParts.find(
        q =>
          q.getQuoteLineId() === +id &&
          selectedQuoteLineIds.includes(q.getQuoteLineId()),
      );
      if (quote) {
        quote.setQuantity(billable[+id].quantity);
        temp.push(quote);
      }
    });
    setPendingQuotable(temp);
    if (setPendingQuotableProp) {
      setPendingQuotableProp(temp);
    }

    if (onAddQuotes) {
      onAddQuotes([
        ...Object.keys(billable).map(id => ({
          quotePart: quoteParts.find(q => q.getQuoteLineId() === +id)!,
          billable: billable[+id].billable,
          quantity: billable[+id].quantity,
        })),
        ...pendingNewQuotable.map(quotePart => ({
          quotePart,
          billable: true,
          quantity: quotePart.getQuantity(),
        })),
      ]);
    }
    setOpen(false);
  }, [
    billable,
    quoteParts,
    onAddQuotes,
    selectedQuoteLineIds,
    pendingNewQuotable,
    setPendingQuotableProp,
  ]);
  const handleToggleNewQuotable = useCallback(
    () => setNewQuotable(!newQuotable),
    [newQuotable],
  );
  const handleSavePendingQuotable = useCallback(async () => {
    let tempPendingQuotable = pendingQuotable;
    let tempPendingNewQuotable = pendingNewQuotable;
    const quoteUsedClientService = new QuoteUsedClient(ENDPOINT);
    if (pendingDeleteQuotable.length > 0) {
      handleDeleteQuoteLine();
    }
    if (
      (tempPendingQuotable.length > 0 || tempPendingNewQuotable.length > 0) &&
      servicesRenderedId
    ) {
      for (let i = 0; i < tempPendingQuotable.length; i++) {
        let quotePart = tempPendingQuotable[i];
        const req = new QuoteUsed();
        req.setQuoteLineId(quotePart.getQuoteLineId());
        req.setQuotedPrice(quotePart.getQuotedPrice());
        req.setQuantity(quotePart.getQuantity());
        req.setServicesRenderedId(servicesRenderedId);
        req.setBillable(quotePart.getIsBillable() === true ? 1 : 0);

        try {
          await quoteUsedClientService.Create(req);
        } catch (err) {
          console.log('failed to add quotable item');
        }
      }
      for (let i = 0; i < tempPendingNewQuotable.length; i++) {
        let quotePart = tempPendingNewQuotable[i];
        const req = new QuoteUsed();
        const quotelineReq = new QuoteLine();
        quotelineReq.setDescription(quotePart.getDescription());
        quotelineReq.setAdjustment(quotePart.getQuotedPrice().toString());
        quotelineReq.setWarranty(2);
        const quotelineRes = await QuoteLineClientService.Create(quotelineReq);
        req.setQuoteLineId(quotelineRes.getId());
        req.setQuotedPrice(quotePart.getQuotedPrice());
        req.setQuantity(quotePart.getQuantity());
        req.setLmpc(quotePart.getIsLmpc() === true ? 1 : 0);
        req.setServicesRenderedId(servicesRenderedId);
        req.setBillable(quotePart.getIsBillable() === true ? 1 : 0);

        try {
          await quoteUsedClientService.Create(req);
        } catch (err) {
          console.log('failed to add quotable item');
        }
      }
      if (onUpdate) {
        await onUpdate();
      }
      let finalQuotable = originalQuotable;
      if (tempPendingQuotable.length > 0) {
        finalQuotable = finalQuotable.concat(...tempPendingQuotable);
      }
      if (tempPendingNewQuotable.length > 0) {
        finalQuotable = finalQuotable.concat(...tempPendingNewQuotable);
      }
      setQuotable(finalQuotable);
      setPendingQuotable([]);
      setPendingNewQuotable([]);
      if (setPendingQuotableProp) {
        setPendingQuotableProp([]);
      }
      if (setPendingNewQuotableProp) {
        setPendingNewQuotableProp([]);
      }
      setSelectedQuoteLineIds([]);
    }
  }, [
    pendingQuotable,
    originalQuotable,
    servicesRenderedId,
    pendingNewQuotable,
    setPendingNewQuotableProp,
    setPendingQuotableProp,
    onUpdate,
    handleDeleteQuoteLine,
    pendingDeleteQuotable,
  ]);
  const handleSavePendingQuotablePendingServicesRenderedId = useCallback(
    async (servicesRenderedId: number) => {
      let tempList = pendingQuotable;
      const quoteUsedClientService = new QuoteUsedClient(ENDPOINT);
      if (pendingDeleteQuotable.length > 0) {
        handleDeleteQuoteLine();
      }
      if (tempList.length > 0 && servicesRenderedId) {
        for (let i = 0; i < tempList.length; i++) {
          let quotePart = tempList[i];
          const req = new QuoteUsed();
          req.setQuoteLineId(quotePart.getQuoteLineId());
          req.setQuotedPrice(quotePart.getQuotedPrice());
          req.setQuantity(quotePart.getQuantity());
          req.setServicesRenderedId(servicesRenderedId);
          req.setBillable(quotePart.getIsBillable() === true ? 1 : 0);

          try {
            await quoteUsedClientService.Create(req);
          } catch (err) {
            console.log('failed to add quotable item');
          }
        }
        if (onUpdate) {
          await onUpdate();
        }
        setQuotable(originalQuotable.concat(...tempList));
        setPendingQuotable([]);
        if (setPendingQuotableProp) {
          setPendingQuotableProp([]);
        }
        setSelectedQuoteLineIds([]);
      }
    },
    [
      pendingQuotable,
      originalQuotable,
      onUpdate,
      setPendingQuotableProp,
      handleDeleteQuoteLine,
      pendingDeleteQuotable,
    ],
  );
  const handleSaveNewQuotable = useCallback(
    (data: Quotable) => {
      const safeData = makeSafeFormObject(data, new Quotable());
      const quantity = safeData.getQuantity();
      const quotePart = new Quotable();
      Object.assign(quotePart, {
        ...safeData,
        quantity,
        isActive: true, // TODO rest default props?
      });
      const newPendingNewQuotable = [...pendingNewQuotable, quotePart];
      setPendingNewQuotable(newPendingNewQuotable);
      if (setPendingNewQuotableProp) {
        setPendingNewQuotableProp(newPendingNewQuotable);
      }
      if (onAddQuotes) {
        onAddQuotes([
          ...Object.keys(billable).map(id => ({
            quotePart: quoteParts.find(q => q.getQuoteLineId() === +id)!,
            billable: billable[+id].billable,
            quantity: billable[+id].quantity,
          })),
          ...newPendingNewQuotable.map(quotePart => ({
            quotePart,
            billable: true,
            quantity: quotePart.getQuantity(),
          })),
        ]);
      }
      setNewQuotable(false);
      setOpen(false);
    },
    [
      pendingNewQuotable,
      onAddQuotes,
      setPendingNewQuotableProp,
      billable,
      quoteParts,
    ],
  );
  let actions: ActionsProps = [];
  if (onUpdate) {
    actions = [
      ...actions,
      {
        label: 'Add',
        onClick: handleToggleOpen,
        disabled: loading,
      },
    ];
  }
  if (servicesRenderedId && onUpdate) {
    actions = [
      ...actions,
      {
        label: 'Save',

        onClick: servicesRenderedId ? handleSavePendingQuotable : undefined,
        disabled:
          loading ||
          (pendingQuotable.length == 0 &&
            pendingDeleteQuotable.length == 0 &&
            pendingNewQuotable.length == 0),
      },
    ];
  }

  const data: Data = loading
    ? makeFakeRows(6, 20)
    : quoteParts
        .filter(quote =>
          filter
            ? quote
                .getDescription()
                .toLocaleLowerCase()
                .includes(filter.toLocaleLowerCase())
            : true,
        )
        .map(quote => [
          {
            value: (
              <Field
                name="selected"
                type="checkbox"
                style={{ marginBottom: 0 }}
                value={selectedQuoteLineIds.includes(quote.getQuoteLineId())}
                onChange={handleToggleQuoteLineSelect(quote.getQuoteLineId())}
              />
            ),
          },
          {
            value: selectedQuoteLineIds.includes(quote.getQuoteLineId()) ? (
              <Field
                name="selectedBillable"
                type="checkbox"
                style={{ marginBottom: 0 }}
                value={billable[quote.getQuoteLineId()].billable}
                onChange={handleToggleBillable(quote.getQuoteLineId())}
              />
            ) : (
              ''
            ),
          },
          { value: quote.getDescription() },
          {
            value: selectedQuoteLineIds.includes(quote.getQuoteLineId()) ? (
              <Field
                name="selected"
                type="number"
                style={{ marginBottom: 0 }}
                value={billable[quote.getQuoteLineId()].quantity}
                onChange={handleToggleBillableQuantity(quote.getQuoteLineId())}
              />
            ) : (
              ''
            ),
          },
          {
            value: usd(
              selectedQuoteLineIds.includes(quote.getQuoteLineId())
                ? billable[quote.getQuoteLineId()].quantity *
                    quote.getQuotedPrice()
                : quote.getQuotedPrice(),
            ),
          },
        ]);
  const dataQuotable: Data = loading
    ? makeFakeRows(4, 5)
    : [
        ...pendingQuotable.map(quote => [
          { value: <strong>{quote.getDescription()}</strong> },
          { value: <strong>{quote.getQuantity()}</strong> },
          { value: <strong>{usd(quote.getQuotedPrice())}</strong> },
          {
            value: (
              <strong>
                {usd(quote.getQuantity() * quote.getQuotedPrice())}
              </strong>
            ),
          },
          {
            value: (
              <div>
                <Tooltip key="delete" content="Delete">
                  <IconButton
                    key="deleteIcon"
                    size="small"
                    onClick={() => handleRemovePending(quote)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]),
        ...pendingNewQuotable.map(quote => [
          { value: <strong>{quote.getDescription()}</strong> },
          { value: <strong>{quote.getQuantity()}</strong> },
          { value: <strong>{usd(quote.getQuotedPrice())}</strong> },
          {
            value: (
              <strong>
                {usd(quote.getQuantity() * quote.getQuotedPrice())}
              </strong>
            ),
          },
          {
            value: (
              <div>
                <Tooltip key="delete" content="Delete">
                  <IconButton
                    key="deleteIcon"
                    size="small"
                    onClick={() => handleRemoveNewPending(quote)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]),
        ...quotable.map(quote => [
          { value: quote.getDescription() },
          { value: quote.getQuantity() },
          { value: usd(quote.getQuotedPrice()) },
          { value: usd(quote.getQuantity() * quote.getQuotedPrice()) },
          {
            value: (
              <div>
                <Tooltip key="delete" content="Delete">
                  <IconButton
                    key="deleteIcon"
                    size="small"
                    onClick={() => handleAddToPendingDelete(quote)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]),
      ];
  return (
    <div>
      <SectionBar title="Supplies / Services" actions={actions} fixedActions />
      <InfoTable
        styles={{ minWidth: '600px' }}
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
          <Form<Quotable>
            title="Adding the following Part of Labor to Current Job Invoice"
            schema={SCHEMA_NEW_QUOTABLE}
            onClose={handleToggleNewQuotable}
            onSave={handleSaveNewQuotable}
            data={new Quotable()}
          />
        </Modal>
      )}
    </div>
  );
};
