import React, { FC, useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintHeaderSubtitleItem } from '../PrintHeader';
import { PrintParagraph } from '../PrintParagraph';
import { ExportJSON } from '../ExportJSON';
import { CalendarHeader } from '../CalendarHeader';
import { ServiceCallMetricsGraph } from '../ServiceCallMetricsGraph';
import {
  makeFakeRows,
  getCurrDate,
  loadServiceCallMetricsByFilter,
} from '../../../helpers';

type ServiceCallInformationType = {
  serviceCallDate: string;
  serviceCalls: number;
  phoneCalls: number;
  averageCustomerLifeTime: number;
  averageCustomerAnnualValue: number;
};

type UserInformationType = {
  serviceCallDate: string;
  users: number;
  activeCustomers: number;
  totalCustomers: number;
  contracts: number;
  installationTypeCalls: number;
};

interface Props {
  onClose?: () => void;
  week: string;
}

const EXPORT_COLUMNS_SERVICE_CALL_INFORMATION = [
  {
    label: 'Service Call Date',
    value: 'serviceCallDate',
  },
  {
    label: 'Service Calls',
    value: 'serviceCalls',
  },
  {
    label: 'Phone Calls',
    value: 'phoneCalls',
  },
  {
    label: 'Average Customer Life Time',
    value: 'averageCustomerLifeTime',
  },
  {
    label: 'Average Customer Annual Value',
    value: 'averageCustomerAnnualValue',
  },
];

const EXPORT_COLUMNS_USER_INFORMATION = [
  {
    label: 'Service Call Date',
    value: 'serviceCallDate',
  },
  {
    label: 'Users',
    value: 'users',
  },
  {
    label: 'Active Customers',
    value: 'activeCustomers',
  },
  {
    label: 'Total Customers',
    value: 'totalCustomers',
  },
  {
    label: 'Contracts',
    value: 'contracts',
  },
  {
    label: 'Intallation-type Calls',
    value: 'installationTypeCalls',
  },
];

const COLUMNS_SERVICE_CALL_INFORMATION = EXPORT_COLUMNS_SERVICE_CALL_INFORMATION.map(
  ({ label }) => label,
);
const COLUMNS_USER_INFORMATION = EXPORT_COLUMNS_USER_INFORMATION.map(
  ({ label }) => label,
);

export const ServiceCallMetrics: FC<Props> = ({ week, onClose }) => {
  const [dateStarted, setDateStarted] = useState<Date>(new Date(week));
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceCallInformations, setServiceCallInformation] = useState<
    ServiceCallInformationType[]
  >([]);
  const [userInformations, setUserInformations] = useState<
    UserInformationType[]
  >([]);
  const load = useCallback(async () => {
    setLoading(true);
    const {
      serviceCallInformation,
      userInformation,
    } = await loadServiceCallMetricsByFilter({
      filter: { week: format(dateStarted, 'yyyy-MM-dd') },
    });
    setServiceCallInformation(serviceCallInformation);
    setUserInformations(userInformation);
    setLoading(false);
  }, [setLoading, dateStarted, setServiceCallInformation, setUserInformations]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [setLoaded, loaded, load]);
  const reload = useCallback(() => setLoaded(false), [setLoaded]);
  const handleWeekChange = useCallback(
    (date: Date) => {
      setDateStarted(date);
      reload();
    },
    [setDateStarted, reload],
  );
  const serviceCallInformationData: Data = loading
    ? makeFakeRows(5, 5)
    : serviceCallInformations.map(entry => {
        const {
          serviceCallDate,
          serviceCalls,
          phoneCalls,
          averageCustomerLifeTime,
          averageCustomerAnnualValue,
        } = entry;
        return [
          { value: serviceCallDate },
          { value: serviceCalls },
          { value: phoneCalls },
          { value: averageCustomerLifeTime },
          { value: averageCustomerAnnualValue },
        ];
      });
  const userInformationData: Data = loading
    ? makeFakeRows(6, 5)
    : userInformations.map(entry => {
        const {
          serviceCallDate,
          users,
          activeCustomers,
          totalCustomers,
          contracts,
          installationTypeCalls,
        } = entry;
        return [
          { value: serviceCallDate },
          { value: users },
          { value: activeCustomers },
          { value: totalCustomers },
          { value: contracts },
          { value: installationTypeCalls },
        ];
      });
  const printHeaderSubtitle = (
    <PrintHeaderSubtitleItem label="Week of" value={week} />
  );
  return (
    <div>
      <CalendarHeader
        title="Service Call Metrics"
        selectedDate={dateStarted}
        onDateChange={handleWeekChange}
        onSubmit={onClose}
        submitLabel="Close"
      >
        <PrintPage
          headerProps={{
            title: 'Service Call Metrics',
            subtitle: printHeaderSubtitle,
          }}
        >
          <PrintParagraph tag="h1">Service Call Information</PrintParagraph>
          <PrintTable
            columns={COLUMNS_SERVICE_CALL_INFORMATION.map((title, idx) =>
              idx ? { title, align: 'right' } : title,
            )}
            data={serviceCallInformationData.map(row =>
              row.map(({ value }) => value),
            )}
          />
          <PrintParagraph tag="h1">User Information</PrintParagraph>
          <PrintTable
            columns={COLUMNS_USER_INFORMATION.map((title, idx) =>
              idx ? { title, align: 'right' } : title,
            )}
            data={userInformationData.map(row => row.map(({ value }) => value))}
          />
        </PrintPage>
      </CalendarHeader>
      <SectionBar
        title="Service Call Information"
        asideContent={
          <ExportJSON
            key={serviceCallInformationData.length}
            json={serviceCallInformations}
            fields={EXPORT_COLUMNS_SERVICE_CALL_INFORMATION}
            filename={`Service_Call_Information_${getCurrDate()}`}
          />
        }
      >
        <InfoTable
          columns={COLUMNS_SERVICE_CALL_INFORMATION.map(name => ({ name }))}
          data={serviceCallInformationData}
          loading={loading}
        />
      </SectionBar>
      <SectionBar
        title="User Information"
        asideContent={
          <ExportJSON
            json={userInformations}
            fields={EXPORT_COLUMNS_USER_INFORMATION}
            filename={`User_Information_${getCurrDate()}`}
          />
        }
      >
        <InfoTable
          columns={COLUMNS_USER_INFORMATION.map(name => ({ name }))}
          data={userInformationData}
          loading={loading}
        />
      </SectionBar>
      <SectionBar title="Graph">
        <ServiceCallMetricsGraph />
      </SectionBar>
    </div>
  );
};
