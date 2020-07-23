import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
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

export const CharityReport: FC<Props> = ({ month, onClose }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({ items: [] });
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadCharityReport(month);
    setData(data);
    setLoading(false);
  }, [setLoading, setData]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const subtitle = useMemo(
    () => format(new Date(`${month.replace('%', '01')}T00:00:00`), 'MMMM yyyy'),
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
                      //@ts-ignore
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
            //@ts-ignore
            data={data.items.map(
              //@ts-ignore
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
