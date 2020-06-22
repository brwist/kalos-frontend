import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
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
  loadSpiffTypes,
  SpiffTypeType,
} from '../../../helpers';

interface Props {
  date: string;
  type: string;
  users: number[];
  onClose?: () => void;
}

const useStyles = makeStyles(theme => ({
  content: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
  tableScreen: {
    fontSize: 14,
    marginBottom: theme.spacing(4),
  },
  table: {
    marginBottom: theme.spacing(4),
  },
}));

const SPIFF_TABLE_COLS = 6;
const COLUMNS = [...Array(SPIFF_TABLE_COLS)].map(() => '');
const FOOTER_HEIGHT = 45;

export const SpiffReport: FC<Props> = ({ date, type, users, onClose }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [spiffTypes, setSpiffTypes] = useState<SpiffTypeType[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const spiffTypes = await loadSpiffTypes();
    setSpiffTypes(spiffTypes);
    const entries = await loadSpiffReportByFilter({ date, type, users });
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
        format(new Date(`${date.replace('%', '01')} 00:00:00`), 'MMMM yyyy'),
      ];
    } else {
      const d = new Date(`${date} 00:00:00`);
      return [
        `Week of ${format(d, 'MMMM d, yyyy')}`,
        `Weekly ${format(d, 'w')}`,
      ];
    }
  }, [type, date]);
  const getContent = (screen: boolean) =>
    entries.map(
      ({
        user,
        toolAllowanceBreakdown: {
          beginningBalance,
          endingBalance,
          overageMonth,
          overageYear,
          purchases,
          purchaseTotal,
        },
        incentiveBreakdown: {
          revokedBonusMonth,
          revokedBonusYear,
          bonusTotal,
          items,
        },
      }) => (
        <div key={user}>
          {!screen && (
            <PrintHeader title="Tool Fund / Incentive Program Report" />
          )}
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
          <div className={screen ? classes.content : ''}>
            <PrintParagraph tag="h2">Tool Allowance Breakdown</PrintParagraph>
            <PrintTable
              className={screen ? classes.tableScreen : classes.table}
              columns={[
                'Tool Purchases',
                {
                  title: `Beginning Balance: ${usd(beginningBalance)}`,
                  align: 'center',
                },
                {
                  title: `Ending Balance: ${usd(endingBalance)}`,
                  align: 'right',
                },
              ]}
              data={[
                //@ts-ignore
                ...purchases.map(({ name, date, price }) => [
                  name,
                  date,
                  usd(price),
                ]),
                [
                  <strong>Tool Purchase Total:</strong>,
                  '',
                  <strong>{usd(purchaseTotal)}</strong>,
                ],
                [
                  `Tool Purchase Overage This Month: ${usd(overageMonth)}`,
                  '',
                  `Tool Purchase Overage This Year: ${usd(overageYear)}`,
                ],
              ]}
            />
            <PrintParagraph tag="h2">Incentive Breakdown</PrintParagraph>
            <PrintTable
              className={screen ? classes.tableScreen : classes.table}
              columns={[
                'Detail',
                'Job #',
                'Status',
                { title: 'Amount', align: 'right' },
              ]}
              data={[
                //@ts-ignore
                ...items.map(({ name, jobNumber, status, amount }) => [
                  name,
                  jobNumber,
                  status,
                  usd(amount),
                ]),
                [
                  <strong>Spiff Bonus Total:</strong>,
                  '',
                  '',
                  <strong>{usd(bonusTotal)}</strong>,
                ],
                [
                  `Revoked Bonus This Month: ${usd(revokedBonusMonth)}`,
                  '',
                  '',
                  `Revoked Bonus This Year: ${usd(revokedBonusYear)}`,
                ],
              ]}
            />
          </div>
          <PrintPageBreak height={FOOTER_HEIGHT} />
        </div>
      ),
    );
  return (
    <>
      <SectionBar
        title="Tool Fund / Incentive Program Report"
        subtitle={<>{subtitle.join(', ')}</>}
        asideContent={
          <>
            <PrintPage
              buttonProps={{
                label: 'Print',
                disabled: loading,
              }}
              downloadPdfFilename={`Tool_Fund_Incentive_Program_Report_${getCurrDate()}`}
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
