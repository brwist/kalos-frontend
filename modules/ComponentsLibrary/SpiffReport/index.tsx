import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintHeader } from '../PrintHeader';
import { PrintFooter } from '../PrintFooter';
import { PrintTable } from '../PrintTable';
import { PrintParagraph } from '../PrintParagraph';
import { PrintPageBreak } from '../PrintPageBreak';
import { SectionBar } from '../SectionBar';
import { InfoTable } from '../InfoTable';
import {
  loadSpiffReportByFilter,
  usd,
  getCurrDate,
  SpiffTypeType,
  SpiffReportLineType,
  TaskClientService,
} from '../../../helpers';
import "./SpiffReport.module.less";

interface Props {
  date: string;
  type: string;
  users: number[];
  onClose?: () => void;
}

const SPIFF_TABLE_COLS = 6;
const COLUMNS = [...Array(SPIFF_TABLE_COLS)].map(() => '');
const FOOTER_HEIGHT = 45;

export const SpiffReport: FC<Props> = ({ date, type, users, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [entries, setEntries] = useState<{
    [key: string]: {
      spiffBonusTotal: number;
      items: SpiffReportLineType[];
    };
  }>({});
  const [spiffTypes, setSpiffTypes] = useState<SpiffTypeType[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const spiffTypes = await TaskClientService.loadSpiffTypes();
    setSpiffTypes(spiffTypes);
    const entries = await loadSpiffReportByFilter({ date, type, users });
    console.log(entries);
    setEntries(entries);
    setLoading(false);
  }, [setLoading]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load, setSpiffTypes]);
  const spiffTypesTable = useMemo(() => {
    const table: string[][] = [];
    let subtable: string[] = [];
    spiffTypes.forEach(({ type }, idx) => {
      if (idx > 0 && idx % SPIFF_TABLE_COLS === 0) {
        table.push(subtable);
        subtable = [];
      }
      subtable.push(type);
    });
    table.push(subtable);
    return table;
  }, [spiffTypes, SPIFF_TABLE_COLS]);
  const subtitle = useMemo(() => {
    if (type === 'Monthly') {
      return [
        format(parseISO(`${date.replace('%', '01')}T00:00:00`), 'MMMM yyyy'),
      ];
    } else {
      const d = parseISO(`${date}T00:00:00`);
      return [
        `Week of ${format(d, 'MMMM d, yyyy')}`,
        `Weekly ${format(d, 'w')}`,
      ];
    }
  }, [type, date]);
  const getContent = (screen: boolean) =>
    Object.keys(entries).map(user => (
      <div key={user}>
        {!screen && <PrintHeader title="Incentive Program Report" />}
        {screen ? (
          <InfoTable columns={[{ name: <big>{user}</big> }]} />
        ) : (
          <PrintParagraph tag="h1" align="right">
            {user}
          </PrintParagraph>
        )}
        {!screen && (
          <PrintParagraph tag="h2" align="right">
            {subtitle[0]}
            {type === 'Weekly' && (
              <>
                <br />
                {subtitle[1]}
              </>
            )}
          </PrintParagraph>
        )}
        <div className={screen ? 'SpiffReportContent' : ''}>
          <PrintParagraph tag="h2">Incentive Breakdown</PrintParagraph>
          <PrintTable
            className={screen ? 'SpiffReportTableScreen' : 'SpiffReportTable'}
            columns={[
              'Detail',
              'Job #',
              'Status',
              { title: 'Amount', align: 'right' },
            ]}
            data={[
              ...entries[user].items.map(
                ({ ext, address, jobNumber, amount }) => [
                  `${ext} - ${address}`,
                  jobNumber,
                  '',
                  usd(amount),
                ],
              ),
              [
                <strong>Spiff Bonus Total:</strong>,
                '',
                '',
                <strong>{usd(entries[user].spiffBonusTotal)}</strong>,
              ],
            ]}
          />
        </div>
        <PrintPageBreak height={FOOTER_HEIGHT} />
      </div>
    ));
  return (
    <>
      <SectionBar
        title="Incentive Program Report"
        subtitle={<>{subtitle.join(', ')}</>}
        asideContent={
          <>
            <PrintPage
              buttonProps={{
                label: 'Print',
                disabled: loading,
              }}
              downloadPdfFilename={`Incentive_Program_Report_${getCurrDate()}`}
            >
              {getContent(false)}
              <PrintFooter height={FOOTER_HEIGHT}>
                <PrintTable
                  columns={COLUMNS}
                  data={spiffTypesTable}
                  noBorders
                  styles={{ fontSize: 7 }}
                />
              </PrintFooter>
            </PrintPage>
            {onClose && <Button label="Close" onClick={onClose} />}
          </>
        }
      />
      {getContent(true)}
    </>
  );
};
