import React, { FC, useCallback, useEffect, useState } from 'react';
import { format, addMonths, addDays } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable, Data, Columns } from '../InfoTable';
import { PlainForm, Schema } from '../PlainForm';
import {
  loadBillingAuditReport,
  formatDate,
  usd,
  makeFakeRows,
} from '../../../helpers';

interface Props {
  month: string;
  onClose?: () => void;
}

type FilterForm = {
  startDate: string;
  endDate: string;
};

const COLUMNS: Columns = [
  { name: 'Date' },
  { name: 'Name' },
  { name: 'Business Name' },
  { name: 'Job Number' },
  { name: 'Payable' },
];

export const BillingAuditReport: FC<Props> = ({ month, onClose }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<any[]>([]);
  const startDate = format(new Date(month.replace('%', '01')), 'yyyy-MM-dd');
  const [form, setForm] = useState<FilterForm>({
    startDate,
    endDate: format(
      addDays(addMonths(new Date(startDate), 1), -1),
      'yyyy-MM-dd',
    ),
  });
  const load = useCallback(async () => {
    setLoading(true);
    const entries = await loadBillingAuditReport(form.startDate, form.endDate);
    setEntries(entries);
    setLoading(false);
  }, [setLoading, setEntries, form]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleSearch = useCallback(() => setLoaded(false), [setForm]);
  const SCHEMA: Schema<FilterForm> = [
    [
      {
        name: 'startDate',
        label: 'Start Date',
        type: 'date',
      },
      {
        name: 'endDate',
        label: 'End Date',
        type: 'date',
        actions: [{ label: 'Search', onClick: handleSearch }],
      },
    ],
  ];
  const data: Data = loading
    ? makeFakeRows(5, 5)
    : (entries.map(({ date, name, businessname, jobNumber, payable }) => [
        { value: formatDate(date) },
        { value: name },
        { value: businessname },
        { value: jobNumber },
        {
          value: usd(payable),
          actions: [
            // TODO clickable
            <IconButton key="download" size="small">
              <DownloadIcon />
            </IconButton>,
            <IconButton key="edit" size="small">
              <EditIcon />
            </IconButton>,
          ],
        },
      ]) as Data);
  return (
    <div>
      <SectionBar
        title="Billing Audit"
        asideContent={
          <>
            <PrintPage
              headerProps={{
                title: 'Billing Audit',
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
                      'Date',
                      'Name',
                      'Business Name',
                      'Job Number',
                      { title: 'Payable', align: 'right' },
                    ]}
                    data={entries.map(
                      ({ date, name, businessname, jobNumber, payable }) => [
                        formatDate(date),
                        name,
                        businessname,
                        jobNumber,
                        usd(payable),
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
      <PlainForm schema={SCHEMA} data={form} onChange={setForm} />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
    </div>
  );
};
