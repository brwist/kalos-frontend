import React, { FC, useState, useEffect, useCallback } from 'react';
import { PrintPage } from '../PrintPage';
import { PrintHeader } from '../PrintHeader';
import { PrintFooter } from '../PrintFooter';
import { PrintTable } from '../PrintTable';
import { PrintParagraph } from '../PrintParagraph';
import { PrintPageBreak } from '../PrintPageBreak';
import { loadSpiffReportByFilter, usd } from '../../../helpers';

interface Props {
  date: string;
  type: 'Monthly' | 'Weekly';
  users: number[];
}

export const SpiffReport: FC<Props> = ({ date, type, users }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [entries, setEntries] = useState<any[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const entries = await loadSpiffReportByFilter({ date, type, users });
    setEntries(entries);
    setLoading(false);
  }, [setLoading]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  console.log({ entries });
  return (
    <PrintPage>
      {entries.map(
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
            <PrintHeader title="Tool Fund / Incentive Program Report" />
            <PrintParagraph tag="h1" align="right">
              {user}
            </PrintParagraph>
            <PrintParagraph tag="h2" align="right">
              Week of June 7, 2020
              <br />
              Weekly 24
            </PrintParagraph>
            <PrintParagraph tag="h2" align="left">
              Tool Allowance Breakdown
            </PrintParagraph>
            <PrintTable
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
            <PrintParagraph tag="h2" align="left">
              Incentive Breakdown
            </PrintParagraph>
            <PrintTable
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
            <PrintPageBreak height={40} />
          </div>
        ),
      )}
      <PrintFooter height={40}>
        <PrintTable
          columns={['', '', '', '', '', '']}
          data={[
            [
              'ACIN - A/C Install',
              'ACJM - A/C Job Manager',
              'ACLD - AC Sale Lead',
              'AIRU - Air Knight or UV Light Sales',
              'BENT - System Sales Commission',
              'CIND - Contract Creation Spiff',
            ],
            [
              'CMSN - Commission',
              'CNCT - PM Contract / Contract Lead',
              'FITY - Infinity Air Purifier Sale',
              'OUTO - Out of Town',
              'PHIN - P/H Install',
              'PHJM - P/H Job Manager',
            ],
            [
              'PRMA - PM',
              'ROCK - Quoted Repairs Spiff',
              'SWAY - Prop Mngr PM Cnct Lead',
              'UNCT - Uncategorized',
              '',
              '',
            ],
          ]}
          noBorders
          styles={{ fontSize: 7 }}
        />
      </PrintFooter>
    </PrintPage>
  );
};
