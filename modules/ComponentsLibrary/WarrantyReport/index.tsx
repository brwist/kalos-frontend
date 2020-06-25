import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { loadWarrantyReport, getCurrDate } from '../../../helpers';

interface Props {
  onClose?: () => void;
}

export const WarrantyReport: FC<Props> = ({ onClose }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadWarrantyReport();
    setData(data);
    setLoading(false);
  }, [setLoading, setData]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const subtitle = useMemo(() => format(new Date(), 'MMMM yyyy'), []);
  return (
    <div>
      <SectionBar
        title="Warranty Report"
        subtitle={subtitle}
        asideContent={
          <>
            <PrintPage
              headerProps={{
                title: 'Warranty Report',
                subtitle,
              }}
              buttonProps={{
                label: 'Print',
                disabled: loading,
              }}
              downloadPdfFilename={`Warranty_Report_${getCurrDate()}`}
            >
              {!loading && (
                <>
                  <PrintTable
                    columns={[
                      'Description',
                      'Job #',
                      'Reference #',
                      'Status',
                      'Priority',
                      'Assigned To',
                    ]}
                    data={data.map(
                      ({
                        briefDdescription,
                        externalId,
                        referenceNumber,
                        statusDesc,
                        priorityDesc,
                        techName,
                      }) => [
                        briefDdescription,
                        externalId,
                        referenceNumber,
                        statusDesc,
                        priorityDesc,
                        techName,
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
              { name: 'Description' },
              { name: 'Job #' },
              { name: 'Reference #' },
              { name: 'Status' },
              { name: 'Priority' },
              { name: 'Assigned To' },
            ]}
            data={data.map(
              ({
                briefDdescription,
                externalId,
                referenceNumber,
                statusDesc,
                priorityDesc,
                techName,
              }) => [
                { value: briefDdescription },
                { value: externalId },
                { value: referenceNumber },
                { value: statusDesc },
                { value: priorityDesc },
                { value: techName },
              ],
            )}
          />
        </>
      )}
    </div>
  );
};
