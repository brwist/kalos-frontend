import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { loadCharityReport, usd, getCurrDate } from '../../../helpers';
import './styles.less';

interface Props {
  month: string;
  onClose?: () => void;
}

interface CharityReport {
  residentialServiceTotal: number;
  residentialAorTotal: number;
  items: {
    technician: string;
    contribution: number;
    averageHourly: number;
  }[];
}

export const CharityReport: FC<Props> = ({ month, onClose }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<CharityReport>({
    residentialAorTotal: 0,
    residentialServiceTotal: 0,
    items: [],
  });
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadCharityReport(month);
    setData(data);
    setLoading(false);
  }, [setLoading, setData, month]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const subtitle = useMemo(
    () => format(parseISO(`${month.replace('%', '01')}T00:00:00`), 'MMMM yyyy'),
    [month],
  );
  return (
    <div>
      <SectionBar
        title="Charity Report"
        subtitle={subtitle}
        asideContent={
          <>
            <PrintPage
              headerProps={{
                title: 'Charity Report',
                subtitle,
              }}
              buttonProps={{
                label: 'Print',
                disabled: loading,
              }}
              downloadPdfFilename={`Charity_Report_${getCurrDate()}`}
            >
              {!loading && (
                <>
                  <PrintTable
                    columns={[
                      'Residential Service Total',
                      {
                        title: usd(data.residentialServiceTotal),
                        align: 'right',
                      },
                    ]}
                    data={[]}
                    skipNoEntriesTest
                  />
                  <PrintTable
                    columns={[
                      'Residential AOR Total',
                      { title: usd(data.residentialAorTotal), align: 'right' },
                    ]}
                    data={[]}
                    skipNoEntriesTest
                  />
                  <PrintTable
                    columns={[
                      'Technician',
                      { title: 'Contribution', align: 'right' },
                      { title: 'Average Hourly', align: 'right' },
                    ]}
                    data={data.items.map(
                      ({ technician, contribution, averageHourly }) => [
                        technician,
                        usd(contribution),
                        usd(averageHourly),
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
              { name: 'Residential Service Total' },
              { name: usd(data.residentialServiceTotal) },
            ]}
            className="CharityReportTable"
          />
          <InfoTable
            columns={[
              { name: 'Residential AOR Total' },
              { name: usd(data.residentialAorTotal) },
            ]}
            className="CharityReportTable"
          />
          <InfoTable
            columns={[
              { name: 'Technician' },
              { name: 'Contribution' },
              { name: 'Average Hourly' },
            ]}
            data={data.items.map(
              ({ technician, contribution, averageHourly }) => [
                { value: technician },
                { value: usd(contribution) },
                { value: usd(averageHourly) },
              ],
            )}
          />
        </>
      )}
    </div>
  );
};
