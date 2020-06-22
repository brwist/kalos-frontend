import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { loadTimeoffSummaryReport, formatDate } from '../../../helpers';

interface Props {
  onClose?: () => void;
}

const useStyles = makeStyles(theme => ({}));

export const TimeoffSummaryReport: FC<Props> = ({ onClose }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<any[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadTimeoffSummaryReport(year);
    setData(data);
    setLoading(false);
  }, [setLoading, setData, year]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  return (
    <div>
      <SectionBar
        title="Timeoff Summary Report"
        subtitle={year}
        asideContent={
          <>
            <PrintPage
              headerProps={{
                title: 'Timeoff Summary Report',
                subtitle: year,
              }}
              buttonProps={{
                label: 'Print',
                disabled: loading,
              }}
            >
              {!loading && (
                <>
                  <PrintTable
                    columns={[
                      'Employee',
                      { title: 'Hire Date', align: 'right' },
                      { title: 'Annual PTO Allowance', align: 'right' },
                      { title: 'PTO', align: 'right' },
                      { title: 'Discretionary', align: 'right' },
                      { title: 'Mandatory', align: 'right' },
                    ]}
                    data={data.map(
                      ({
                        employeeName,
                        hireDate,
                        annualPtoAllowance,
                        pto,
                        discretionary,
                        mandatory,
                      }) => [
                        employeeName,
                        formatDate(hireDate),
                        annualPtoAllowance.toFixed(2),
                        pto.toFixed(2),
                        discretionary.toFixed(2),
                        mandatory.toFixed(2),
                      ],
                    )}
                  />
                </>
              )}
            </PrintPage>
            {onClose && <Button label="Close" onClick={onClose} />}
          </>
        }
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          <InfoTable
            columns={[
              { name: 'Employee' },
              { name: 'Hire Date' },
              { name: 'Annual PTO Allowance' },
              { name: 'PTO' },
              { name: 'Discretionary' },
              { name: 'Mandatory' },
            ]}
            data={data.map(
              ({
                employeeName,
                hireDate,
                annualPtoAllowance,
                pto,
                discretionary,
                mandatory,
              }) => [
                { value: employeeName },
                { value: formatDate(hireDate) },
                {
                  value: (
                    <span
                      style={pto > annualPtoAllowance ? { color: 'red' } : {}}
                    >
                      {annualPtoAllowance.toFixed(2)}
                    </span>
                  ),
                },
                { value: pto.toFixed(2) },
                { value: discretionary.toFixed(2) },
                { value: mandatory.toFixed(2) },
              ],
            )}
          />
        </>
      )}
    </div>
  );
};
