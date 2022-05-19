import React, { FC, useState, useCallback } from 'react';
import { SectionBar } from '../SectionBar';
import { Form } from '../Form';
import { Schema } from '../PlainForm';
import { Modal } from '../Modal';
import { EventsReport } from '../EventsReport';
import { ActivityLogReport } from '../ActivityLogReport';
import { PerformanceMetrics } from '../PerformanceMetrics';
import { TimesheetValidationReport } from '../TimesheetValidationReport';
import { DeletedServiceCallsReport } from '../DeletedServiceCallsReport';
import IconButton from '@material-ui/core/IconButton';
import { TransactionValidationReport } from '../TransactionValidationReport';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { CallbackReport } from '../CallbackReport';
import { ServiceCallMetrics } from '../ServiceCallMetrics';
import { WarrantyReport } from '../WarrantyReport';
import { PromptPaymentReport } from '../PromptPaymentReport';
import { TimeoffSummaryReport } from '../TimeoffSummaryReport';
import { BillingAuditReport } from '../BillingAuditReport';
import { ReceiptJournalReport } from '../ReceiptsJournalReport';
import { SalesJournalReport } from '../SalesJournalReport';

import { format, parseISO } from 'date-fns';
import { ResidentialHeatmap } from '../../ResidentialHeatmap/main';
import {
  makeOptions,
  makeLast12MonthsOptions,
  getWeekOptions,
  trailingZero,
  ApiKeyClientService,
} from '../../../helpers';
import {
  OPTION_ALL,
  JOB_STATUS_LIST,
  BILLING_STATUS_TYPE_LIST,
  NOTIFICATIONS_STATUS_TYPE_LIST,
  SPIFF_KIND_TYPE_LIST,
} from '../../../constants';

import { EditProject } from '../EditProject';
import { CostReport } from '../CostReport';
import './Reports.module.less';
import { CostReportCSV } from '../CostReportCSV';

export type FilterForm = {
  status?: string;
  startDate?: string;
  endDate?: string;
  week?: string;
  month?: string;
  monthlyWeekly?: string;
  users?: string;
  blank?: string;
};

type JobReportForm = {
  jobNumber: number;
};

type TransactionReport = {
  year: number;
};
export interface Props {
  loggedUserId: number;
}

const DATES_ERROR = (
  <>
    <strong>Start Date</strong> should be before <strong>End Date</strong>.
  </>
);

const UNDER_CONSTRUCTION = (
  <div style={{ padding: 10, fontFamily: 'arial' }}>Under construction...</div>
);

const WEEK_OPTIONS_0 = getWeekOptions(52, -31).reverse();
const WEEK_OPTIONS_1 = getWeekOptions(52);

const LAST_12_MONTHS_0 = makeLast12MonthsOptions(false);
const LAST_12_MONTHS_1 = makeLast12MonthsOptions(false, -1);

const SCHEMA_DATES_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
];

const SCHEMA_JOB_STATUS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'status',
      label: 'Status',
      required: true,
      options: makeOptions(JOB_STATUS_LIST, true),
    },
  ],
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
];

const SCHEMA_BILLING_STATUS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'status',
      label: 'Status',
      required: true,
      options: makeOptions(BILLING_STATUS_TYPE_LIST, true),
    },
  ],
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
];

const SCHEMA_NOTIFICATIONS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'status',
      label: 'Status',
      required: true,
      options: makeOptions(NOTIFICATIONS_STATUS_TYPE_LIST, true),
    },
  ],
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
];

const SCHEMA_SERVICE_CALL_METRICS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'week',
      label: 'Select Week',
      options: WEEK_OPTIONS_0,
      required: true,
    },
  ],
];

const SCHEMA_TRAINING_METRICS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      name: 'users',
      label: 'Select Users',
      type: 'technicians',
      required: true,
    },
  ],
];

const SCHEMA_LAST_12_MONTHS_REPORT: Schema<FilterForm> = [
  [
    {
      name: 'month',
      label: 'Month',
      options: LAST_12_MONTHS_1,
      required: true,
    },
  ],
];

const getCurrWeek = () => {
  const d = parseISO(format(new Date(), 'yyyy-MM-dd'));
  return `${d.getFullYear()}-${trailingZero(d.getMonth() + 1)}-${trailingZero(
    d.getDate() - d.getDay(),
  )}`;
};
export const Reports: FC<Props> = ({ loggedUserId }) => {
  const [jobStatusReport, setJobStatusReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [jobStatusDatesError, setJobStatusDatesError] =
    useState<boolean>(false);
  const [jobStatusReportOpen, setJobStatusReportOpen] =
    useState<boolean>(false);
  const [billingStatusReport, setBillingStatusReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [salesJournalReport, setSalesJournalReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [billingStatusDatesError, setBillingStatusDatesError] =
    useState<boolean>(false);
  const [billingStatusReportOpen, setBillingStatusReportOpen] =
    useState<boolean>(false);
  const [salesJournalReportOpen, setSalesJournalReportOpen] =
    useState<boolean>(false);
  const [notificationsReport, setNotificationsReport] = useState<FilterForm>({
    status: OPTION_ALL,
  });
  const [notificationsDatesError, setNotificationsDatesError] =
    useState<boolean>(false);
  const [notificationsReportOpen, setNotificationsReportOpen] =
    useState<boolean>(false);
  const [performanceMetricsReport, setPerformanceMetricsReport] =
    useState<FilterForm>({});
  const [timesheetValidationReport, setTimesheetValidationReport] =
    useState<FilterForm>({});
  const [receiptsJournalReport, setReceiptsJournalReport] =
    useState<FilterForm>({});

  const [transactionValidationReport, setTransactionValidationReport] =
    useState<TransactionReport>({ year: new Date().getFullYear() });

  const [formKeyTransaction, setFormKeyTransaction] = useState<number>(0);

  const [performanceMetricsDatesError, setPerformanceMetricsDatesError] =
    useState<boolean>(false);
  const [performanceMetricsReportOpen, setPerformanceMetricsReportOpen] =
    useState<boolean>(false);
  const [deletedServiceCallsReport, setDeletedServiceCallsReport] =
    useState<FilterForm>({});
  const [deletedServiceCallsDatesError, setDeletedServiceCallsDatesError] =
    useState<boolean>(false);
  const [deletedServiceCallsReportOpen, setDeletedServiceCallsReportOpen] =
    useState<boolean>(false);
  const [heatMapReportOpen, setHeatMapReportOpentOpen] =
    useState<boolean>(false);
  const [callbackReport, setCallbackReport] = useState<FilterForm>({});
  const [callbackDatesError, setCallbackDatesError] = useState<boolean>(false);
  const [callbackReportOpen, setCallbackReportOpen] = useState<boolean>(false);
  const [serviceCallMetricsReport, setServiceCallMetricsReport] =
    useState<FilterForm>({
      week: getCurrWeek(),
    });

  const [serviceCallMetricsReportOpen, setServiceCallMetricsReportOpen] =
    useState<boolean>(false);

  const [timesheetValidationReportOpen, setTimesheetValidationReportOpen] =
    useState<boolean>(false);
  const [receiptsJournalReportOpen, setReceiptsJournalReportOpen] =
    useState<boolean>(false);
  const [transactionValidationReportOpen, setTransactionValidationReportOpen] =
    useState<boolean>(false);
  const [timesheetValidationError, setTimesheetValidationError] =
    useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>();
  const [serviceCallZipCodeReportOpen, setServiceCallZipCodeReportOpen] =
    useState<boolean>(false);
  const [warrantyReportOpen, setWarrantyReportOpen] = useState<boolean>(false);
  const [trainingMetricsReport, setTrainingMetricsReport] =
    useState<FilterForm>({});
  const [trainingMetricsDatesError, setTrainingMetricsDatesError] =
    useState<boolean>(false);
  const [trainingMetricsReportOpen, setTrainingMetricsReportOpen] =
    useState<boolean>(false);
  const [billingAuditReport, setBillingAuditReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_1[0].value,
  });
  const [billingAuditReportOpen, setBillingAuditReportOpen] =
    useState<boolean>(false);
  const [promptPaymentReport, setPromptPaymentReport] = useState<FilterForm>({
    month: LAST_12_MONTHS_1[0].value,
  });
  const [promptPaymentReportOpen, setPromptPaymentReportOpen] =
    useState<boolean>(false);
  const [timeoffSummaryReportOpen, setTimeoffSummaryReportOpen] =
    useState<boolean>(false);
  const [jobNumberBasedReportOpen, setJobNumberBasedReportOpen] = useState<
    JobReportForm | undefined
  >();
  const [jobNumberForReport] = useState<JobReportForm>({} as JobReportForm);
  const handleOpenJobStatusReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setJobStatusDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setJobStatusDatesError(true);
        return;
      }
      if (data && data.status) {
        setJobStatusReport(data);
      }
      setJobStatusReportOpen(open);
    },
    [setJobStatusReport, setJobStatusReportOpen, setJobStatusDatesError],
  );
  const handleOpenBillingStatusReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setBillingStatusDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setBillingStatusDatesError(true);
        return;
      }
      if (data && data.status) {
        setBillingStatusReport(data);
      }
      setBillingStatusReportOpen(open);
    },
    [
      setBillingStatusReport,
      setBillingStatusReportOpen,
      setBillingStatusDatesError,
    ],
  );

  const handleOpenSalesJournalReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setBillingStatusDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        return;
      }
      if (data && data.status) {
        setSalesJournalReport(data);
        setSalesJournalReportOpen(open);
      }
    },
    [],
  );

  const handleOpenNotificationsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setNotificationsDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setNotificationsDatesError(true);
        return;
      }
      if (data && data.status) {
        setNotificationsReport(data);
      }
      setNotificationsReportOpen(open);
    },
    [
      setNotificationsReport,
      setNotificationsReportOpen,
      setNotificationsDatesError,
    ],
  );
  const handleOpenPerformanceMetricsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setPerformanceMetricsDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setPerformanceMetricsDatesError(true);
        return;
      }
      if (data && data.startDate) {
        setPerformanceMetricsReport(data);
      }
      setPerformanceMetricsReportOpen(open);
    },
    [setPerformanceMetricsReport, setPerformanceMetricsDatesError],
  );

  const handleOpenTimesheetValidationReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setTimesheetValidationError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setTimesheetValidationError(true);
        return;
      }
      if (data && data.startDate) {
        setTimesheetValidationReport(data);
      }
      setTimesheetValidationReportOpen(open);
    },
    [setTimesheetValidationReport, setTimesheetValidationReportOpen],
  );
  const handleOpenTransactionValidationReportToggle = useCallback(
    (open: boolean) => (data: TransactionReport) => {
      setTransactionValidationReport(data);
      setTransactionValidationReportOpen(open);
    },
    [setTransactionValidationReport, setTransactionValidationReportOpen],
  );

  const handleSetReceiptsJournalReport = useCallback(
    (open: boolean) => (data: FilterForm) => {
      setReceiptsJournalReport(data);
      setReceiptsJournalReportOpen(open);
    },
    [],
  );
  const handleSetSalesJournalReport = useCallback(
    (open: boolean) => (data: FilterForm) => {
      setSalesJournalReport(data);
      setSalesJournalReportOpen(open);
    },
    [],
  );

  const handleOpenDeletedServiceCallsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      console.log({ data });
      setDeletedServiceCallsDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setDeletedServiceCallsDatesError(true);
        console.log('we had an error');
        return;
      }
      if (data && data.startDate) {
        setDeletedServiceCallsReport(data);
      }
      setDeletedServiceCallsReportOpen(open);
    },
    [
      setDeletedServiceCallsReport,
      setDeletedServiceCallsReportOpen,
      setDeletedServiceCallsDatesError,
    ],
  );
  const handleOpenCallbackReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setCallbackDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setCallbackDatesError(true);
        return;
      }
      if (data && data.startDate) {
        setCallbackReport(data);
      }
      setCallbackReportOpen(open);
    },
    [setCallbackReport, setCallbackReportOpen, setCallbackDatesError],
  );
  const handleOpenServiceCallMetricsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      if (data && data.week) {
        setServiceCallMetricsReport(data);
      }
      setServiceCallMetricsReportOpen(open);
    },
    [setServiceCallMetricsReport, setServiceCallMetricsReportOpen],
  );

  const handleOpenTimesheetValidationToggle = useCallback(
    (open: boolean) => () => setTimesheetValidationReportOpen(open),
    [setTimesheetValidationReportOpen],
  );

  const handleOpenReceiptJournalToggle = useCallback(
    (open: boolean) => () => setReceiptsJournalReportOpen(open),
    [],
  );
  const handleOpenSalesJournalToggle = useCallback(
    (open: boolean) => () => setSalesJournalReportOpen(open),
    [],
  );
  const handleOpenTransactionValidationToggle = useCallback(
    (open: boolean) => () => setTransactionValidationReportOpen(open),
    [setTransactionValidationReportOpen],
  );
  const handleOpenHeatMap = useCallback(
    (open: boolean) => async () => {
      if (apiKey == undefined) {
        const key = await ApiKeyClientService.getKeyByKeyName('google_maps');
        setApiKey(key.getApiKey());
      }
      setHeatMapReportOpentOpen(open);
    },
    [setHeatMapReportOpentOpen, apiKey],
  );
  const handleOpenServiceCallZipCodeReportToggle = useCallback(
    (open: boolean) => () => setServiceCallZipCodeReportOpen(open),
    [setServiceCallZipCodeReportOpen],
  );
  const handleOpenWarrantyReportToggle = useCallback(
    (open: boolean) => () => setWarrantyReportOpen(open),
    [setWarrantyReportOpen],
  );
  const handleOpenTrainingMetricsReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      setTrainingMetricsDatesError(false);
      if (
        data &&
        data.endDate &&
        data.startDate &&
        data.endDate < data.startDate
      ) {
        setTrainingMetricsDatesError(true);
        return;
      }
      if (data && data.status) {
        setTrainingMetricsReport(data);
      }
      setTrainingMetricsReportOpen(open);
    },
    [
      setTrainingMetricsReport,
      setTrainingMetricsReportOpen,
      setTrainingMetricsDatesError,
    ],
  );
  const handleYearChange = useCallback(
    (step: number) => () => {
      setTransactionValidationReport({
        year: transactionValidationReport.year + step,
      });
      setFormKeyTransaction(formKeyTransaction + 1);
    },
    [
      setTransactionValidationReport,
      formKeyTransaction,
      setFormKeyTransaction,
      transactionValidationReport,
    ],
  );
  const SCHEMA_YEAR: Schema<TransactionReport> = [
    [
      {
        name: 'year',
        label: 'Year',
        startAdornment: (
          <IconButton size="small" onClick={handleYearChange(-1)}>
            <ChevronLeftIcon />
          </IconButton>
        ),
        endAdornment: (
          <IconButton size="small" onClick={handleYearChange(1)}>
            <ChevronRightIcon />
          </IconButton>
        ),
      },
    ],
  ];
  const handleOpenBillingAuditReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      if (data && data.month) {
        setBillingAuditReport(data);
      }
      setBillingAuditReportOpen(open);
    },
    [setBillingAuditReport, setBillingAuditReportOpen],
  );
  const handleOpenPromptPaymentReportToggle = useCallback(
    (open: boolean) => (data?: FilterForm) => {
      if (data && data.month) {
        setPromptPaymentReport(data);
      }
      setPromptPaymentReportOpen(open);
    },
    [setPromptPaymentReport, setPromptPaymentReportOpen],
  );
  const handleOpenTimeoffSummaryReportToggle = useCallback(
    (open: boolean) => () => setTimeoffSummaryReportOpen(open),
    [setTimeoffSummaryReportOpen],
  );
  const handleOpenJobNumberBasedReportToggle = useCallback(
    (open: JobReportForm | undefined) => setJobNumberBasedReportOpen(open),
    [setJobNumberBasedReportOpen],
  );

  const SCHEMA_JOB_REPORTS: Schema<JobReportForm> = [
    [
      {
        name: 'jobNumber',
        label: 'Job Number for Report',
        type: 'eventId',
      },
    ],
  ];
  return (
    <div className="ReportsWrapper">
      <Form
        title="Job Status Report"
        schema={SCHEMA_JOB_STATUS_REPORT}
        data={jobStatusReport}
        onSave={handleOpenJobStatusReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={jobStatusDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Billing Status Report"
        schema={SCHEMA_BILLING_STATUS_REPORT}
        data={billingStatusReport}
        onSave={handleOpenBillingStatusReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={billingStatusDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Notifications Report"
        schema={SCHEMA_NOTIFICATIONS_REPORT}
        data={notificationsReport}
        onSave={handleOpenNotificationsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={notificationsDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Performance Metrics"
        schema={SCHEMA_DATES_REPORT}
        data={performanceMetricsReport}
        onSave={handleOpenPerformanceMetricsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={performanceMetricsDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Deleted Service Calls"
        schema={SCHEMA_DATES_REPORT}
        data={deletedServiceCallsReport}
        onSave={handleOpenDeletedServiceCallsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={deletedServiceCallsDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Callback Report"
        schema={SCHEMA_DATES_REPORT}
        data={callbackReport}
        onSave={handleOpenCallbackReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={callbackDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Service Call Metrics"
        schema={SCHEMA_SERVICE_CALL_METRICS_REPORT}
        data={serviceCallMetricsReport}
        onSave={handleOpenServiceCallMetricsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
      />

      <Form
        title="Timesheet Validation Report"
        schema={SCHEMA_DATES_REPORT}
        data={timesheetValidationReport}
        onSave={handleOpenTimesheetValidationReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={timesheetValidationError ? DATES_ERROR : undefined}
      />
      <div key="transactionreportDiv">
        <Form
          key={formKeyTransaction}
          title="Transaction Validation Report"
          schema={SCHEMA_YEAR}
          data={transactionValidationReport}
          onSave={handleOpenTransactionValidationReportToggle(true)}
          submitLabel="Report"
          onClose={null}
        />
      </div>
      <div key="receiptReport">
        <Form
          title="Receipts Journal Report"
          schema={SCHEMA_DATES_REPORT}
          data={receiptsJournalReport}
          onSave={handleSetReceiptsJournalReport(true)}
          submitLabel="Report"
          onClose={null}
        />
      </div>
      <div key="salesReport">
        <Form
          title="Sales Journal Report"
          schema={SCHEMA_BILLING_STATUS_REPORT}
          data={salesJournalReport}
          onSave={handleSetSalesJournalReport(true)}
          submitLabel="Report"
          onClose={null}
        />
      </div>
      <SectionBar
        title="Service Call Zip Code"
        actions={[
          {
            label: 'Report',
            onClick: handleOpenServiceCallZipCodeReportToggle(true),
          },
        ]}
        fixedActions
      />
      <SectionBar
        title="Warranty Report"
        actions={[
          {
            label: 'Report',
            onClick: handleOpenWarrantyReportToggle(true),
          },
        ]}
        fixedActions
      />
      <Form
        title="Training Metrics"
        schema={SCHEMA_TRAINING_METRICS_REPORT}
        data={trainingMetricsReport}
        onSave={handleOpenTrainingMetricsReportToggle(true)}
        submitLabel="Report"
        onClose={null}
        error={trainingMetricsDatesError ? DATES_ERROR : undefined}
      />
      <Form
        title="Billing Audit"
        schema={SCHEMA_LAST_12_MONTHS_REPORT}
        data={billingAuditReport}
        onSave={handleOpenBillingAuditReportToggle(true)}
        submitLabel="Report"
        onClose={null}
      />
      <Form
        title="Prompt Payment Report"
        schema={SCHEMA_LAST_12_MONTHS_REPORT}
        data={promptPaymentReport}
        onSave={handleOpenPromptPaymentReportToggle(true)}
        submitLabel="Report"
        onClose={null}
      />
      <SectionBar
        title="Timeoff Summary"
        actions={[
          {
            label: 'Report',
            onClick: handleOpenTimeoffSummaryReportToggle(true),
          },
        ]}
        fixedActions
      />
      <SectionBar
        title="Residential Heat Map"
        actions={[
          {
            label: 'Report',
            onClick: handleOpenHeatMap(true),
          },
        ]}
        fixedActions
      />
      <Form
        title="Job Number Report"
        schema={SCHEMA_JOB_REPORTS}
        data={jobNumberForReport}
        onClose={null}
        onSave={(saved: JobReportForm) =>
          handleOpenJobNumberBasedReportToggle(saved)
        }
        submitLabel="Report"
      />
      {jobStatusReportOpen && (
        <Modal open onClose={handleOpenJobStatusReportToggle(false)} fullScreen>
          <EventsReport
            kind="jobStatus"
            loggedUserId={loggedUserId}
            filter={{
              ...jobStatusReport,
              status:
                jobStatusReport.status === OPTION_ALL
                  ? undefined
                  : jobStatusReport.status,
            }}
            onClose={handleOpenJobStatusReportToggle(false)}
          />
        </Modal>
      )}
      {billingStatusReportOpen && (
        <Modal
          open
          onClose={handleOpenBillingStatusReportToggle(false)}
          fullScreen
        >
          <EventsReport
            kind="paymentStatus"
            loggedUserId={loggedUserId}
            filter={{
              ...billingStatusReport,
              status:
                billingStatusReport.status === OPTION_ALL
                  ? undefined
                  : billingStatusReport.status,
            }}
            onClose={handleOpenBillingStatusReportToggle(false)}
          />
        </Modal>
      )}
      {notificationsReportOpen && (
        <Modal
          open
          onClose={handleOpenNotificationsReportToggle(false)}
          fullScreen
        >
          <ActivityLogReport
            status={
              notificationsReport.status === 'Deletions only' ? 'Deleted' : ''
            }
            activityDateStart={notificationsReport.startDate!}
            activityDateEnd={notificationsReport.endDate!}
            onClose={handleOpenNotificationsReportToggle(false)}
          />
        </Modal>
      )}
      {performanceMetricsReportOpen && (
        <Modal
          open
          onClose={handleOpenPerformanceMetricsReportToggle(false)}
          fullScreen
        >
          <PerformanceMetrics
            onClose={handleOpenPerformanceMetricsReportToggle(false)}
            dateStart={performanceMetricsReport.startDate!}
            dateEnd={performanceMetricsReport.endDate!}
          />
        </Modal>
      )}
      {deletedServiceCallsReportOpen && (
        <Modal
          open
          onClose={handleOpenDeletedServiceCallsReportToggle(false)}
          fullScreen
        >
          <DeletedServiceCallsReport
            loggedUserId={loggedUserId}
            onClose={handleOpenDeletedServiceCallsReportToggle(false)}
            dateStarted={deletedServiceCallsReport.startDate!}
            dateEnded={deletedServiceCallsReport.endDate!}
          />
        </Modal>
      )}
      {callbackReportOpen && (
        <Modal open onClose={handleOpenCallbackReportToggle(false)} fullScreen>
          <CallbackReport
            onClose={handleOpenCallbackReportToggle(false)}
            dateStart={callbackReport.startDate!}
            dateEnd={callbackReport.endDate!}
          />
        </Modal>
      )}
      {serviceCallMetricsReportOpen && (
        <Modal
          open
          onClose={handleOpenServiceCallMetricsReportToggle(false)}
          fullScreen
        >
          <ServiceCallMetrics
            week={serviceCallMetricsReport.week!}
            onClose={handleOpenServiceCallMetricsReportToggle(false)}
          />
        </Modal>
      )}
      {timesheetValidationReportOpen && (
        <Modal
          open
          onClose={handleOpenTimesheetValidationToggle(false)}
          fullScreen
        >
          <TimesheetValidationReport
            loggedUserId={loggedUserId}
            onClose={handleOpenTimesheetValidationToggle(false)}
            dateStarted={timesheetValidationReport.startDate!}
            dateEnded={timesheetValidationReport.endDate!}
          />
        </Modal>
      )}
      {transactionValidationReportOpen && (
        <Modal
          key={'transactionValidationReportModal'}
          open
          onClose={handleOpenTransactionValidationToggle(false)}
          fullScreen
        >
          <div key={'TransactionvalidationDiv'}>
            <TransactionValidationReport
              key={'transactionValidationModule'}
              loggedUserId={loggedUserId}
              onClose={handleOpenTransactionValidationToggle(false)}
              year={transactionValidationReport.year}
            />
          </div>
        </Modal>
      )}
      {receiptsJournalReportOpen && (
        <Modal open onClose={handleOpenReceiptJournalToggle(false)} fullScreen>
          <ReceiptJournalReport
            loggedUserId={loggedUserId}
            onClose={handleOpenReceiptJournalToggle(false)}
            startDate={receiptsJournalReport.startDate!}
            endDate={receiptsJournalReport.endDate!}
          />
        </Modal>
      )}
      {salesJournalReportOpen && (
        <Modal open onClose={handleOpenSalesJournalToggle(false)} fullScreen>
          <SalesJournalReport
            loggedUserId={loggedUserId}
            onClose={handleOpenSalesJournalToggle(false)}
            startDate={salesJournalReport.startDate!}
            endDate={salesJournalReport.endDate!}
            paymentStatus={salesJournalReport.status!}
          />
        </Modal>
      )}
      {serviceCallZipCodeReportOpen && (
        <Modal
          open
          onClose={handleOpenServiceCallZipCodeReportToggle(false)}
          fullScreen
        >
          <SectionBar
            title="Service Call Zip Code"
            actions={[
              {
                label: 'Close',
                onClick: () =>
                  handleOpenServiceCallZipCodeReportToggle(false)(),
              },
            ]}
            fixedActions
          />
          {UNDER_CONSTRUCTION}
        </Modal>
      )}
      {heatMapReportOpen && apiKey != undefined && (
        <Modal
          open
          onClose={handleOpenServiceCallZipCodeReportToggle(false)}
          fullScreen
        >
          <SectionBar
            title="Residential Heat Map"
            actions={[
              {
                label: 'Close',
                onClick: () => handleOpenHeatMap(false)(),
              },
            ]}
            fixedActions
          />
          <ResidentialHeatmap loggedUserId={loggedUserId} apiKey={apiKey} />
        </Modal>
      )}
      {warrantyReportOpen && (
        <Modal open onClose={handleOpenWarrantyReportToggle(false)} fullScreen>
          <WarrantyReport onClose={handleOpenWarrantyReportToggle(false)} />
        </Modal>
      )}
      {trainingMetricsReportOpen && (
        <Modal
          open
          onClose={handleOpenTrainingMetricsReportToggle(false)}
          fullScreen
        >
          <SectionBar
            title="Training Metrics"
            actions={[
              {
                label: 'Close',
                onClick: () => handleOpenTrainingMetricsReportToggle(false)(),
              },
            ]}
            fixedActions
          />
          {UNDER_CONSTRUCTION}
        </Modal>
      )}
      {billingAuditReportOpen && (
        <Modal
          open
          onClose={handleOpenBillingAuditReportToggle(false)}
          fullScreen
        >
          <BillingAuditReport
            month={billingAuditReport.month!}
            loggedUserId={loggedUserId}
            onClose={handleOpenBillingAuditReportToggle(false)}
          />
        </Modal>
      )}
      {promptPaymentReportOpen && (
        <Modal
          open
          onClose={handleOpenPromptPaymentReportToggle(false)}
          fullScreen
        >
          <PromptPaymentReport
            month={promptPaymentReport.month!}
            onClose={handleOpenPromptPaymentReportToggle(false)}
          />
        </Modal>
      )}
      {timeoffSummaryReportOpen && (
        <Modal
          open
          onClose={handleOpenTimeoffSummaryReportToggle(false)}
          fullScreen
        >
          <TimeoffSummaryReport
            onClose={handleOpenTimeoffSummaryReportToggle(false)}
          />
        </Modal>
      )}
      {jobNumberBasedReportOpen && (
        <Modal
          open
          onClose={() => handleOpenJobNumberBasedReportToggle(undefined)}
          fullScreen={true}
        >
          <SectionBar
            title="Job Number Report"
            actions={[
              {
                label: 'Close',
                onClick: () => handleOpenJobNumberBasedReportToggle(undefined),
              },
            ]}
            fixedActions
          />
          <CostReportCSV
            serviceCallId={jobNumberBasedReportOpen.jobNumber}
            loggedUserId={loggedUserId}
          />
        </Modal>
      )}
    </div>
  );
};
