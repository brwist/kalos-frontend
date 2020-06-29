import React, { FC, useCallback, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { PlainForm, Schema } from '../PlainForm';
import { loadBillingAuditReport, formatDate, usd } from '../../../helpers';

interface Props {
  onClose?: () => void;
}

type FilterForm = {
  startDate: string;
  endDate: string;
};

export const BillingAuditReport: FC<Props> = ({ onClose }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState<FilterForm>({
    startDate: '2020-05-01',
    endDate: '2020-05-31',
  });
  const [formKey, setFormKey] = useState<number>(0);
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadBillingAuditReport(form.startDate, form.endDate);
    setData(data);
    setLoading(false);
  }, [setLoading, setData, form]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
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
      },
    ],
  ];
  const { startDate, endDate } = form;
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
                    data={data.map(
                      ({ date, name, businessname, jobNumber, payable }) => [
                        date,
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <PlainForm
            key={formKey}
            schema={SCHEMA}
            data={form}
            onChange={setForm}
          />
          <InfoTable
            columns={[
              { name: 'Date' },
              { name: 'Name' },
              { name: 'Business Name' },
              { name: 'Job Number' },
              { name: 'Payable' },
            ]}
            data={data.map(
              ({ date, name, businessname, jobNumber, payable }) => [
                { value: formatDate(date) },
                { value: name },
                { value: businessname },
                { value: jobNumber },
                { value: usd(payable) },
              ],
            )}
          />
        </>
      )}
    </div>
  );
};
