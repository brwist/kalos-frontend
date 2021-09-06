import React, { FC, useCallback, useEffect, useState } from 'react';
import { format, addMonths, addDays } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';
import ListIcon from '@material-ui/icons/ListAlt';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable, Data, Columns } from '../InfoTable';
import { PlainForm, Schema } from '../PlainForm';
import { ServiceCall } from '../ServiceCall';
import { Modal } from '../Modal';
import { Tooltip } from '../Tooltip';
import {
  loadBillingAuditReport,
  formatDate,
  usd,
  makeFakeRows,
  BillingAuditType,
} from '../../../helpers';

import { useDispatch, useSelector } from 'react-redux';
import { billAuditReport,selectBillingReport } from './billingAuditReportSlice';

// TODO Errors left issues with search functionality

interface Props {
  month: string;
  loggedUserId: number;
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
  { name: 'History' },
];

export const BillingAuditReport: FC<Props> = ({
  month,
  loggedUserId,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<BillingAuditType[]>([]);
  const [serviceCallEdited, setServiceCallEdited] =
    useState<BillingAuditType>();
  const startDate = format(new Date(month.replace('%', '01')), 'yyyy-MM-dd');
  const [form, setForm] = useState<FilterForm>({
    startDate,
    endDate: format(
      addDays(addMonths(new Date(startDate), 1), -1),
      'yyyy-MM-dd',
    ),
  });
  const dispatch = useDispatch();

  const load = useCallback(async () => {
    setLoading(true);
    const entries = await loadBillingAuditReport(form.startDate);
    setEntries(entries);
    setLoading(false);
  }, [setLoading, setEntries, form]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleSearch = useCallback(() => setLoaded(false), []);
  const handleSetServiceCallEdited = useCallback(
    (serviceCallEdited?: BillingAuditType) => () =>
      setServiceCallEdited(serviceCallEdited),
    [setServiceCallEdited],
  );
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
    ? makeFakeRows(6, 5)
    : (entries.map(entry => {
        const { date, name, businessname, jobNumber, payable, items } = entry;
        dispatch(billAuditReport({
          date: formatDate(date),
          name:name,
          businessName:businessname,
          jobNumber:jobNumber,
          payable:usd(payable),
        }));
        return [
          {
            value: formatDate(date),
            onClick: handleSetServiceCallEdited(entry),
          },
          {
            value: name,
            onClick: handleSetServiceCallEdited(entry),
          },
          {
            value: businessname,
            onClick: handleSetServiceCallEdited(entry),
          },
          {
            value: jobNumber,
            onClick: handleSetServiceCallEdited(entry),
          },
          {
            value: usd(payable),
            onClick: handleSetServiceCallEdited(entry),
          },
          {
            value: (
              <Tooltip
                content={
                  <>
                    {items.map(({ id, date, payable, payed }) => (
                      <div key={id}>
                        <span
                          style={{
                            display: 'inline-block',
                            marginRight: 8,
                            width: 80,
                            textAlign: 'right',
                          }}
                        >
                          {formatDate(date)}
                        </span>
                        {payable === payed ? `Payed ${usd(payed)}` : 'Invoiced'}
                      </div>
                    ))}
                  </>
                }
                placement="left-start"
              >
                <IconButton size="small">
                  <ListIcon />
                </IconButton>
              </Tooltip>
            ),
            actions: [
              // TODO clickable
              <IconButton key="download" size="small">
                <DownloadIcon />
              </IconButton>,
              <IconButton
                key="edit"
                size="small"
                onClick={handleSetServiceCallEdited(entry)}
              >
                <EditIcon />
              </IconButton>,
            ],
          },
        ];
      }) as Data);
  return (
    <>
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
      {serviceCallEdited && (
        <Modal open onClose={handleSetServiceCallEdited()} fullScreen>
          <ServiceCall
            onClose={handleSetServiceCallEdited()}
            loggedUserId={loggedUserId}
            serviceCallId={serviceCallEdited.eventId}
            propertyId={serviceCallEdited.propertyId}
            userID={serviceCallEdited.userId}
          />
        </Modal>
      )}
    </>
  );
};
