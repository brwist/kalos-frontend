import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintParagraph } from '../PrintParagraph';
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
                bigLogo: true,
                withKalosAddress: true,
              }}
              buttonProps={{
                label: 'Print',
                disabled: loading,
              }}
              downloadPdfFilename={`Warranty_Report_${getCurrDate()}`}
            >
              <PrintParagraph
                tag="h1"
                align="right"
                style={{ marginBottom: 0 }}
              >
                Warranty Report
              </PrintParagraph>
              <PrintParagraph tag="h2" align="right" style={{ marginTop: 0 }}>
                {subtitle}
              </PrintParagraph>
              <PrintParagraph tag="h2" align="center">
                Active Warranty Claims
              </PrintParagraph>
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
