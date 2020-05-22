import React, { FC, useState, useCallback, useEffect } from 'react';
import { SectionBar } from '../SectionBar';
import { Modal } from '../Modal';
import { InfoTable, Data, Columns } from '../InfoTable';
import { QuotePart } from '@kalos-core/kalos-rpc/QuotePart';
import { QuoteLinePart } from '@kalos-core/kalos-rpc/QuoteLinePart';
import { QuoteLine } from '@kalos-core/kalos-rpc/QuoteLine';
import {
  loadQuoteParts,
  loadQuoteLines,
  loadQuoteLineParts,
  makeFakeRows,
} from '../../../helpers';
import { QUOTE_PART_AVAILABILITY } from '../../../constants';

type QuotePartType = QuotePart.AsObject;
type QuoteLinePartType = QuoteLinePart.AsObject;
type QuoteLineType = QuoteLine.AsObject;

interface Props {}

const COLUMNS: Columns = [
  { name: 'Selected' },
  { name: 'Billable' },
  { name: 'Part/Labor' },
  { name: 'Qty' },
  { name: 'Price' },
  { name: 'Availability' },
];

export const QuoteSelector: FC<Props> = ({}) => {
  const [open, setOpen] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [quoteParts, setQuoteParts] = useState<QuotePartType[]>([]);
  const [quoteLineParts, setQuoteLineParts] = useState<QuoteLinePartType[]>([]);
  const [quoteLines, setQuoteLines] = useState<QuoteLineType[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const [quoteParts, quoteLines, quoteLineParts] = await Promise.all([
      loadQuoteParts(),
      loadQuoteLines(),
      loadQuoteLineParts(),
    ]);
    setQuoteParts(quoteParts);
    setQuoteLineParts(quoteLineParts);
    setQuoteLines(quoteLines);
    setLoaded(true);
    setLoading(false);
  }, [setLoaded, setLoading]);
  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);
  const handleToggleOpen = useCallback(() => setOpen(!open), [open, setOpen]);
  console.log({ quoteParts, quoteLines, quoteLineParts });
  const data: Data = loading
    ? makeFakeRows(6, 20)
    : quoteParts.map(({ description, cost, availability }) => [
        { value: '' },
        { value: '' },
        { value: description },
        { value: '' },
        { value: `$ ${cost}` },
        { value: QUOTE_PART_AVAILABILITY[availability] },
      ]);

  const getQ = (quotePartId: number) => {
    const quotePart = quoteParts.find(({ id }) => id === quotePartId);
    const quoteLinePart = quotePart
      ? quoteLineParts.find(({ quotePartId }) => quotePartId === quotePart.id)
      : undefined;
    const quoteLine = quoteLinePart
      ? quoteLines.find(({ id }) => id === quoteLinePart.quoteLineId)
      : undefined;
    return { quotePart, quoteLinePart, quoteLine };
  };
  console.log(getQ(3));
  return (
    <div>
      <SectionBar
        title="Supplies / Services"
        actions={[{ label: 'Add', onClick: handleToggleOpen }]}
        fixedActions
      />
      {open && (
        <Modal open onClose={handleToggleOpen} fullScreen>
          <SectionBar
            title="Select Item(s)"
            actions={[{ label: 'Close', onClick: handleToggleOpen }]}
            fixedActions
          />
          <InfoTable
            columns={COLUMNS}
            data={data}
            hoverable
            loading={loading}
          />
        </Modal>
      )}
    </div>
  );
};
